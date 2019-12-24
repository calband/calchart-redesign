import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Serializable from '../util/Serializable';

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 * - Step Two
 *   - FMHS 4 E
 *   - FMHS 4 W
 *   - [MTHS E]
 *
 * @property continuities - Execute this list of continuities after waiting a certain amount of time
 */
export default class ContinuityStepTwo extends Serializable<ContinuityStepTwo> implements BaseContinuity {
  readonly continuityId: CONTINUITY_IDS = CONTINUITY_IDS.STEP_TWO;

  duration: number = 8;

  continuities: BaseContinuity[] = [];

  humanReadableText: string = '';

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContinuityStepTwo> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== '') return this.humanReadableText;
    // TODO: Implement
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    // TODO: Implement
  }
}
