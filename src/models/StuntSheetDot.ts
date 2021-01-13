import { FlowBeat } from "./util/FlowBeat";
import Serializable from "./util/Serializable";

// Global ID counter for the next dot
let NEXT_DOT_ID = 0;

/**
 * Defines the position and direction of a marcher for a specific StuntSheet.
 *
 * @property id            - Uniquely identifies a dot. Can be -1 if not
 *                           relevant, e.g. for grapher tool dots. Used for
 *                           connecting dots between stuntsheets, and labels.
 * @property x             - EW position of the first beat
 * @property y             - NS position of the first beat
 * @property dotLabelIndex - Which label to use in Show.dotLabels. This is
 *                           a cached value for stuntsheets after the first.
 * @property dotTypeIndex  - Which set of continuities to use in
 *                           StuntSheet.dotTypes
 * @property nextDotId     - The dot in the next stuntsheet to generate
 *                           a flow toward
 * @property cachedFlow    - Cached so that the flow does not need to be
 *                           recalculated again. The 0 index is the "Hup!" beat
 *                           and is represented by x and y.
 */
export default class StuntSheetDot extends Serializable<StuntSheetDot> {
  id = -1;

  x = 0;

  y = 0;

  dotLabelIndex: number | null = null;

  dotTypeIndex = 0;

  nextDotId: number | null = null;

  cachedFlow: FlowBeat[] | null = null;

  constructor(dotJson: Partial<StuntSheetDot> = {}) {
    super();

    if (dotJson.id === undefined) {
      dotJson.id = NEXT_DOT_ID++;
    } else if (dotJson.id >= NEXT_DOT_ID) {
      NEXT_DOT_ID = dotJson.id + 1;
    }

    this.fromJson(dotJson);
  }

  xAtBeat(beat: number): number {
    return this.cachedFlow && this.cachedFlow.length > 0 && beat >= 0
      ? this.cachedFlow[Math.min(beat, this.cachedFlow.length - 1)].x
      : this.x;
  }

  yAtBeat(beat: number): number {
    return this.cachedFlow && this.cachedFlow.length > 0 && beat >= 0
      ? this.cachedFlow[Math.min(beat, this.cachedFlow.length - 1)].y
      : this.y;
  }
}
