import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 * - Step Two
 *   - FMHS 4 E
 *   - FMHS 4 W
 *   - [MTHS E]
 * 
 * @property continuities - Execute this list of continuities after waiting a certain amount of time
 */
export default class ContinuityStepTwo implements BaseContinuity {
  continuityId: CONTINUITY_IDS;

  duration: number;

  continuities: BaseContinuity[];

  humanReadableText: string;

  marchType: MARCH_TYPES;

  constructor(marchType: MARCH_TYPES) {
    this.continuityId = CONTINUITY_IDS.FOLLOW_THE_LEADER;
    this.duration = 0;
    this.continuities = [];
    this.humanReadableText = '';
    this.marchType = marchType;
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
