import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';

/**
 * Similar to follow the leader, but the leader also follows the tail.
 */
export default class ContinuityCounterMarch implements BaseContinuity {
  continuityId: CONTINUITY_IDS;

  duration: number;

  humanReadableText: string;

  marchType: MARCH_TYPES;

  constructor(duration: number, marchType: MARCH_TYPES) {
    this.continuityId = CONTINUITY_IDS.FOLLOW_THE_LEADER;
    this.duration = duration;
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
