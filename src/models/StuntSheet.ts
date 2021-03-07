import StuntSheetDot from "./StuntSheetDot";
import { BaseCont } from "./continuity/BaseCont";
import ContInPlace from "./continuity/ContInPlace";
import Serializable from "./util/Serializable";
import { loadContinuity } from "./continuity/load-continuity";
import DotAppearance from "./DotAppearance";
import Warning, { WarningType } from './util/warning';

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

  warnings: Warning[] = [];

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
   * Calculates warnings associated with this stunt sheet
   */
  calculateWarnings() {
    this.warnings = []

    // Ensure no dots are too close
    this.stuntSheetDots.forEach(dot1 => {
      this.stuntSheetDots.forEach(dot2 => {
        if (dot1.id !== dot2.id) {
          const dx = Math.abs(dot1.x - dot2.x);
          const dy = Math.abs(dot1.y - dot2.y);
          if (dx === 0 && dy === 0) {
            this.warnings.push(new Warning({
              name: "Dots Overlapping",
              description: `Dots ${dot1.id} and ${dot2.id} are overlapping`,
              warningType: WarningType.ERROR,
            }))
          } else if (dx < 1 && dy < 1) {
            this.warnings.push(new Warning({
              name: "Dots too close",
              description: `Dots ${dot1.id} and ${dot2.id} are less than 1 step away from eachother`
            }))
          }
        }
      });
    });

    // Ensure that each dot type has at least one dot
    for (let i = 0; i < this.dotTypes.length; i++) {
      if (!this.stuntSheetDots.some((dot: StuntSheetDot) => dot.dotTypeIndex == i)) {
        this.warnings.push(new Warning({
          name: "Dot Type Has No Dots",
          description: `Dot Type ${i + 1} Has No Dots`
        }))
      }
    }
  }

  /** 
   * Recursively updates warnings
   */
  recurseWarnings() {
    this.calculateWarnings();
    this.stuntSheetDots.forEach(element => {
      element.calculateWarnings();
    });
  }
}
