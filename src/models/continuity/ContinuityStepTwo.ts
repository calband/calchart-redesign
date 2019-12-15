import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Deserializable from '../util/Deserializable';

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 * - Step Two
 *   - FMHS 4 E
 *   - FMHS 4 W
 *   - [MTHS E]
 * 
 * @property continuities - Execute this list of continuities after waiting a certain amount of time
 */
export default class ContinuityStepTwo extends Deserializable<ContinuityStepTwo> implements BaseContinuity {
  continuityId: CONTINUITY_IDS = CONTINUITY_IDS.STEP_TWO;

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

  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    if (endDot === undefined) return;
    // TODO: Implement
  }
}
