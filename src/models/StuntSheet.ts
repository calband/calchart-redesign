import StuntSheetDot from "./StuntSheetDot";
import { BaseCont } from "./continuity/BaseCont";
import ContInPlace from "./continuity/ContInPlace";
import Serializable from "./util/Serializable";
import { loadContinuity } from "./continuity/load-continuity";
import DotAppearance from "./DotAppearance";
import Issue, { IssueType } from "./util/issue";

// Global ID counter for the next stuntsheet
let NEXT_SS_ID = 0;

/**
 * Defines the positions/directions in a formation and the continuities
 * used to reach the next position.
 *
 * @property id             - Uniquely defines a stuntsheet
 * @property title          - High level description
 * @property stuntSheetDots - The collection of positions that make up a
 *                            formation
 * @property dotTypes       - The set of continuities used to describe the
 *                            movements to get to the next StuntSheet
 * @property beats          - How many beats to execute the continuities to the
 *                            next StuntSheet
 * @property nextSSId       - Used as a pointer to the next SS. Used for validation
 *                            when building flows
 * @property dotId          - The id to give the next created dot
 */
export default class StuntSheet extends Serializable<StuntSheet> {
  id = -1;

  title = "";

  stuntSheetDots: StuntSheetDot[] = [];

  dotTypes: BaseCont[][] = [[new ContInPlace()]];

  dotAppearances: DotAppearance[] = [new DotAppearance()];

  beats = 16;

  dotId = 1;

  nextSSId: number | null = null;

  issues: Issue[] = [];

  constructor(json: Partial<StuntSheet> = {}) {
    super();

    if (json.id === undefined) {
      json.id = NEXT_SS_ID++;
    } else if (json.id >= NEXT_SS_ID) {
      NEXT_SS_ID = json.id + 1;
    }

    if (json.stuntSheetDots !== undefined) {
      json.stuntSheetDots = json.stuntSheetDots.map(
        (dot: StuntSheetDot): StuntSheetDot => new StuntSheetDot(dot)
      );
    }
    if (json.dotTypes !== undefined) {
      json.dotTypes = json.dotTypes.map((dotType: BaseCont[]): BaseCont[] => {
        return dotType.map(
          (continuity: BaseCont): BaseCont => {
            return loadContinuity(continuity);
          }
        );
      });
    }
    if (json.dotAppearances !== undefined) {
      json.dotAppearances = json.dotAppearances.map(
        (dotAppearance: DotAppearance): DotAppearance =>
          new DotAppearance(dotAppearance)
      );
    }
    this.fromJson(json);
  }

  addDots(dots: Partial<StuntSheetDot>[] = []): void {
    this.stuntSheetDots = this.stuntSheetDots.concat(
      dots.map((dot) => new StuntSheetDot(dot))
    );
  }

  removeDots(indices: number[]): void {
    this.stuntSheetDots = this.stuntSheetDots.filter(
      (dot) => !indices.includes(dot.id)
    );
  }

  moveDots(newPositions: [number, [number, number]][]): void {
    for (const newPosition of newPositions) {
      const selectedDot = this.stuntSheetDots.find(
        (dot) => dot.id === newPosition[0]
      );
      if (selectedDot) {
        selectedDot.x = newPosition[1][0];
        selectedDot.y = newPosition[1][1];
      }
    }
  }

  /**
   * Calculates issues associated with this stunt sheet
   */
  calculateIssuesShallow(ss: number): void {
    this.issues = [];
    // Ensure no dots are too close
    // proximity map maps from an "x,y" coordinate of a dot to all the ddots that are near it
    const proximityMap: Map<string, number[]> = new Map<string, number[]>();
    this.stuntSheetDots.forEach((dot) => {
      const key: string = [Math.round(dot.x), Math.round(dot.y)].join(",");
      const entry: number[] = proximityMap.get(key) || [];
      entry.push(dot.id);
      proximityMap.set(key, entry);
    });
    for (const [location, dots] of proximityMap) {
      if (dots.length > 1) {
        this.issues.push(
          new Issue({
            name: "Dots Too Close",
            description: `Dots ${dots.join(", ")} are overlapping at [${
              location[0]
            }, ${location[1]}]`,
            issueType: IssueType.ERROR,
            stuntSheets: [ss],
            dots: dots,
          })
        );
      }
    }

    // Ensure that each dot type has at least one dot
    for (let i = 0; i < this.dotTypes.length; i++) {
      if (
        !this.stuntSheetDots.some(
          (dot: StuntSheetDot) => dot.dotTypeIndex === i
        )
      ) {
        this.issues.push(
          new Issue({
            name: "Dot Type Has No Dots",
            description: `Dot Type ${i + 1} Has No Dots`,
            stuntSheets: [ss],
          })
        );
      }
    }
  }

  /**
   * Recursively updates issues
   */
  calculateIssuesDeep(ss: number): void {
    this.calculateIssuesShallow(ss);
    this.stuntSheetDots.forEach((element, id) => {
      element.calculateIssuesShallow(ss, id);
    });
  }
}
