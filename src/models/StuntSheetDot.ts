import { FlowBeat } from './util/types';

/**
 * Defines the position and direction of a marcher for a specific StuntSheet.
 * 
 * @property x             - EW position
 * @property y             - NS position
 * @property dotLabelIndex - Which label to use in Show.dotLabels
 * @property dotTypeIndex  - Which set of continuities to use in StuntSheet.dotTypes
 * @property cachedFlow    - Cached so that the flow does not need to be recalculated again
 */
export default class StuntSheetDot {
  x: number;

  y: number;

  dotLabelIndex: number|null;

  dotTypeIndex: number;

  cachedFlow: FlowBeat[]|null;

  constructor(x: number, y: number, dotLabelIndex?: number) {
    this.x = x;
    this.y = y;
    this.dotLabelIndex = dotLabelIndex !== undefined ? dotLabelIndex : null;
    this.dotTypeIndex = 0;
    this.cachedFlow = null;
  }
}
