import { FlowBeat } from './util/types';
import Serializable from './util/Serializable';

/**
 * Defines the position and direction of a marcher for a specific StuntSheet.
 *
 * @property x             - EW position of the first beat
 * @property y             - NS position of the first beat
 * @property dotLabelIndex - Which label to use in Show.dotLabels
 * @property dotTypeIndex  - Which set of continuities to use in StuntSheet.dotTypes
 * @property cachedFlow    - Cached so that the flow does not need to be recalculated again
 */
export default class StuntSheetDot extends Serializable<StuntSheetDot> {
  x: number = 0;

  y: number = 0;

  dotLabelIndex: number | null = null;

  dotTypeIndex: number = 0;

  cachedFlow: FlowBeat[] | null = null;

  constructor(dotJson: Partial<StuntSheetDot> = {}) {
    super();
    this.fromJson(dotJson);
  }
}
