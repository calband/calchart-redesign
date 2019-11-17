import StuntSheetDot from './StuntSheetDot';
import BaseContinuity from './continuity/BaseContinuity';
import ContinuityInPlace from './continuity/ContinuityInPlace';
import { DIRECTIONS, MARCH_TYPES } from './util/constants';

/**
 * Defines the positions/directions in a formation and the continuities
 * used to reach the next position.
 */
export default class StuntSheet {
  stuntSheetDots: StuntSheetDot[];

  dotTypes: BaseContinuity[][];

  beats: number;

  constructor() {
    this.stuntSheetDots = [];
    this.dotTypes = [[new ContinuityInPlace(0, DIRECTIONS.E, MARCH_TYPES.HS)]];
    this.beats = 16;
  }
}
