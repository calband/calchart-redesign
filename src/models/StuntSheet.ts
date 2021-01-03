import StuntSheetDot from "./StuntSheetDot";
import BaseCont from "./continuity/BaseCont";
import ContInPlace from "./continuity/ContInPlace";
import Serializable from "./util/Serializable";
import { loadContinuity } from "./continuity/load-continuity";
import DotAppearance from "./DotAppearance";

/**
 * Defines the positions/directions in a formation and the continuities
 * used to reach the next position.
 *
 * @property title          - High level description
 * @property stuntSheetDots - The collection of positions that make up a
 *                            formation
 * @property dotTypes       - The set of continuities used to describe the
 *                            movements to get to the next StuntSheet
 * @property beats          - How many beats to execute the continuities to the
 *                            next StuntSheet
 */
export default class StuntSheet extends Serializable<StuntSheet> {
  title = "";

  stuntSheetDots: StuntSheetDot[] = [];

  dotTypes: BaseCont[][] = [[new ContInPlace()]];

  dotAppearances: DotAppearance[] = [new DotAppearance()];

  beats = 16;

  constructor(json: Partial<StuntSheet> = {}) {
    super();
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

  addDot(dot: StuntSheetDot): void {
    this.stuntSheetDots.push(dot);
  }

  removeDot(index: number): void {
    this.stuntSheetDots.splice(index, 1);
  }

  moveDot(index: number, position: [number, number]): void {
    if (index >= this.stuntSheetDots.length) {
      return;
    }
    this.stuntSheetDots[index].x = position[0];
    this.stuntSheetDots[index].y = position[1];
  }
}
