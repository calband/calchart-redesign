import Field from "./Field";
import StuntSheet from "./StuntSheet";
import StuntSheetDot from "./StuntSheetDot";
import { BaseCont } from "./continuity/BaseCont";
import { FlowBeat, initializeFlow } from "./util/FlowBeat";
import Serializable from "./util/Serializable";
import Issue, { IssueType } from "./util/issue";

// Increment upon making show metadata changes that break previous versions.
const METADATA_VERSION = 1;

/**
 * Defines all metadata to edit, render, and animate a Calchart show.
 * These would be items we would want to be saved and restored, or undoable.
 *
 * @property metadataVersion - Upon loading the show, determines what
 *                             migrations are needed to make the show
 *                             compatible with future CalChart versions
 * @property title           - Used to categorize saved shows
 * @property dotLabels       - A list of names used for each dot
 * @property field           - Defines the sizing of the field
 * @property stuntSheets     - The set of all StuntSheet objects
 * @property selectedSS      - The currently selected Stunt Sheet
 * @property beat            - The point in time the show is in
 * @property selectedDotIds  - which dotIDs are selected
 */
export default class Show extends Serializable<Show> {
  metadataVersion: number = METADATA_VERSION;

  title = "Example Show";

  dotLabels: string[] = [];

  field: Field = new Field();

  stuntSheets: StuntSheet[] = [new StuntSheet({ title: "Stuntsheet 1" })];

  selectedSS = 0;

  beat = 0;

  selectedDotIds: number[] = [];

  issues: Issue[] = [];

  constructor(showJson: Partial<Show> = {}) {
    super();
    if (showJson.field !== undefined) {
      showJson.field = new Field(showJson.field);
    }
    if (showJson.stuntSheets !== undefined) {
      showJson.stuntSheets.forEach(
        (stuntSheet: StuntSheet, index: number, array: StuntSheet[]): void => {
          array[index] = new StuntSheet(stuntSheet);
        }
      );
    }
    this.fromJson(showJson);
  }

  /**
   * For each StuntSheetDot in the specified StuntSheet, calculate and store
   * the flow based on it's continuities in stuntSheetDot.cachedFlow.
   *
   * Note that the index 0 is the "Hup!" beat. Therefore, index 1 is beat 1,
   * and so on.
   */
  generateFlows(stuntSheetIndex: number): void {
    if (stuntSheetIndex < 0 || stuntSheetIndex >= this.stuntSheets.length) {
      throw new Error(
        `stuntSheetIndex (${stuntSheetIndex}) is invalid with stuntsheet` +
          ` length ${this.stuntSheets.length}`
      );
    }

    const startSS: StuntSheet = this.stuntSheets[stuntSheetIndex];
    const endSS: StuntSheet | null =
      stuntSheetIndex + 1 < this.stuntSheets.length
        ? this.stuntSheets[stuntSheetIndex + 1]
        : null;

    startSS.stuntSheetDots.forEach((startDot: StuntSheetDot): void => {
      let endDot: StuntSheetDot | undefined;
      if (endSS && startDot.nextDotId !== null) {
        endDot = endSS.stuntSheetDots.find(
          (dot: StuntSheetDot): boolean => startDot.nextDotId === dot.id
        );
      }

      const flow: FlowBeat[] = initializeFlow(startDot);
      const continuities: BaseCont[] = startSS.dotTypes[startDot.dotTypeIndex];

      continuities.forEach((continuity: BaseCont): void => {
        continuity.addToFlow(flow, endDot, startDot.id);
      });

      startDot.cachedFlow = flow;
    });

    startSS.nextSSId = endSS ? endSS.id : null;
  }

  /**
   * Generate an array of labels for each dot in a stuntsheet. If dot labels do
   * not exist, use the dot's id surrounded by brackets. The brackets indicate
   * to the user that the dot needs to be assigned a label.
   */
  dotsWithLabelsForSS(stuntSheetIndex: number): [string, StuntSheetDot][] {
    if (stuntSheetIndex < 0 || stuntSheetIndex >= this.stuntSheets.length) {
      throw new Error(
        `Cannot generate dot labels for stuntsheet index ${stuntSheetIndex}`
      );
    }
    const stuntSheet = this.stuntSheets[stuntSheetIndex];
    return stuntSheet.stuntSheetDots.map((dot) => {
      const label =
        dot.dotLabelIndex !== null && dot.dotLabelIndex < this.dotLabels.length
          ? this.dotLabels[dot.dotLabelIndex]
          : `[${dot.id}]`;
      return [label, dot];
    });
  }

  /**
   * Calculates any issues associated with the show
   */
  calculateIssuesShallow(): void {
    this.issues = [];
    // There should be a title
    if (this.title === "") {
      this.issues.push(
        new Issue({
          name: "No Title",
          description: "There isn't a title",
        })
      );
    }

    // Must be at least one StuntSheet
    if (this.stuntSheets.length === 0) {
      this.issues.push(
        new Issue({
          name: "No Stuntsheets",
          description: "There are no stuntsheets in the show",
          issueType: IssueType.ERROR,
        })
      );
    } else {
      // There should be the same number of dots in each stunt sheet
      let prev: number = this.stuntSheets[0].stuntSheetDots.length;
      for (let i = 1; i < this.stuntSheets.length; i++) {
        if (prev !== this.stuntSheets[i].stuntSheetDots.length) {
          this.issues.push(
            new Issue({
              name: "Stuntsheet Dot Count",
              description: `Stuntsheet ${
                i + 1
              } has a different number of dots than the previous stuntsheet (${
                this.stuntSheets[i].stuntSheetDots.length
              } vs ${prev})`,
              stuntSheets: [i, i - 1],
            })
          );
        }
        prev = this.stuntSheets[i].stuntSheetDots.length;
      }
    }
  }

  /**
   * Recursively updates issues
   */
  calculateIssuesDeep(): void {
    this.calculateIssuesShallow();
    this.stuntSheets.forEach((element, ss) => {
      element.calculateIssuesDeep(ss);
    });
  }
}
