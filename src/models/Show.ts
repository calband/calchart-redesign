import Field from "./Field";
import StuntSheet from "./StuntSheet";
import StuntSheetDot from "./StuntSheetDot";
import BaseCont from "./continuity/BaseCont";
import { FlowBeat, initializeFlow } from "./util/FlowBeat";
import Serializable from "./util/Serializable";

// Increment upon making show metadata changes that break previous versions.
const METADATA_VERSION = 1;

/**
 * Defines all metadata to edit, render, and animate a Calchart show.
 *
 * @property metadataVersion - Upon loading the show, determines what
 *                             migrations are needed to make the show
 *                             compatible with future CalChart versions
 * @property title           - Used to categorize saved shows
 * @property dotLabels       - A list of names used for each dot
 * @property field           - Defines the sizing of the field
 * @property stuntSheets     - The set of all StuntSheet objects
 */
export default class Show extends Serializable<Show> {
  metadataVersion: number = METADATA_VERSION;

  title = "Example Show";

  dotLabels: string[] = [];

  field: Field = new Field();

  stuntSheets: StuntSheet[] = [new StuntSheet({ title: "Stuntsheet 1" })];

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
}
