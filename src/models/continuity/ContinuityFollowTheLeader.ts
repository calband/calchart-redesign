import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 * 
 * @property leaderPath - Defines the flow that the leader will take
 */
export default class ContinuityFollowTheLeader implements BaseContinuity {
  continuityId: CONTINUITY_IDS;

  duration: number;

  leaderPath: FlowBeat[];

  humanReadableText: string;

  marchType: MARCH_TYPES;

  constructor(marchType: MARCH_TYPES) {
    this.continuityId = CONTINUITY_IDS.FOLLOW_THE_LEADER;
    this.duration = 0;
    this.leaderPath = [];
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
