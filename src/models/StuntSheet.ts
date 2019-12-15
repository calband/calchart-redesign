import StuntSheetDot from './StuntSheetDot';
import BaseContinuity from './continuity/BaseContinuity';
import ContinuityInPlace from './continuity/ContinuityInPlace';
import { DIRECTION_TO_DEGREES, MARCH_TYPES } from './util/constants';
import Deserializable from './util/Deserializable';
import { loadContinuity } from './continuity/load-continuity';

/**
 * Defines the positions/directions in a formation and the continuities
 * used to reach the next position.
 * 
 * @property stuntSheetDots - The collection of positions that make up a formation
 * @property dotTypes       - The set of continuities used to describe the movements to get to the next StuntSheet
 * @property beats          - How many beats to execute the continuities to the next StuntSheet
 */
export default class StuntSheet extends Deserializable<StuntSheet> {
  stuntSheetDots: StuntSheetDot[] = [];

  dotTypes: BaseContinuity[][] = [[new ContinuityInPlace()]];

  beats: number = 16;

  constructor(json?: Partial<StuntSheet>) {
    super();
    if (json !== undefined) {
      if (json.stuntSheetDots !== undefined) {
        json.stuntSheetDots = json.stuntSheetDots.map((dot: StuntSheetDot) => {
          return new StuntSheetDot(dot);
        });
      }
      if (json.dotTypes !== undefined) {
        json.dotTypes = json.dotTypes.map((dotType: BaseContinuity[]) => {
          return dotType.map((continuity: BaseContinuity) => {
            return loadContinuity(continuity);
          })
        });
      }
    }
    this.fromJson(json);
  }
}
