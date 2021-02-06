import StuntSheetDot from "./StuntSheetDot";
import { BaseCont } from "./continuity/BaseCont";
import ContInPlace from "./continuity/ContInPlace";
import Serializable from "./util/Serializable";
import { loadContinuity } from "./continuity/load-continuity";
import DotAppearance from "./DotAppearance";

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
}
