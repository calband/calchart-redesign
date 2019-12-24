import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { DIRECTION_TO_DEGREES, MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import { startPositionHelper } from './continuity-util';
import Serializable from '../util/Serializable';

/**
 * Stay in the same position for the specified duration, direction, and march type.
 *  - MTHS 8 E
 *  - MTMM 4 SW
 *  - [Close N]
 *  - Vamp E
 */
export default class ContinuityInPlace extends Serializable<ContinuityInPlace> implements BaseContinuity {
  readonly continuityId: CONTINUITY_IDS = CONTINUITY_IDS.IN_PLACE;

  duration: number = 0;

  direction: DIRECTION_TO_DEGREES = DIRECTION_TO_DEGREES.E;

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  humanReadableText: string = '';

  constructor(json: Partial<ContinuityInPlace> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== '') return this.humanReadableText;

    const directionText: string = DIRECTION_TO_DEGREES[this.direction];

    let prefix = '';
    if (this.marchType === MARCH_TYPES.HS || this.marchType === MARCH_TYPES.MINI_MILITARY) {
      prefix = 'MT';
    }

    return this.duration === 0 ? `[${prefix}${this.marchType} ${directionText}]` : `${prefix}${this.marchType} ${this.duration} ${directionText}`;
  }

  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot): void {
    const [x, y]: [number, number] = startPositionHelper(flow, startDot);
    const flowBeat: FlowBeat = {
      x,
      y,
      direction: this.direction,
      marchType: this.marchType,
    };

    for (let beat = 1; beat <= Math.max(this.duration, 1); beat += 1) {
      flow.push(flowBeat);
    }
  }
}
