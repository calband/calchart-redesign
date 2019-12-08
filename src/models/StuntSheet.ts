import StuntSheetDot from './StuntSheetDot';
import BaseContinuity from './continuity/BaseContinuity';
import ContinuityInPlace from './continuity/ContinuityInPlace';
import { DIRECTION_TO_DEGREES, MARCH_TYPES } from './util/constants';

/**
 * Defines the positions/directions in a formation and the continuities
 * used to reach the next position.
 * 
 * @property stuntSheetDots - The collection of positions that make up a formation
 * @property dotTypes       - The set of continuities used to describe the movements to get to the next StuntSheet
 * @property beats          - How many beats to execute the continuities to the next StuntSheet
 */
export default class StuntSheet {
  stuntSheetDots: StuntSheetDot[];

  dotTypes: BaseContinuity[][];

  beats: number;

  constructor() {
    this.stuntSheetDots = [];
    this.dotTypes = [[new ContinuityInPlace(0, DIRECTION_TO_DEGREES.E, MARCH_TYPES.HS)]];
    this.beats = 16;
  }
}
