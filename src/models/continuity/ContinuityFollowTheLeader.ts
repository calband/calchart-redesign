import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Deserializable from '../util/Deserializable';

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 * 
 * @property leaderPath - Defines the flow that the leader will take
 */
export default class ContinuityFollowTheLeader extends Deserializable<ContinuityFollowTheLeader> implements BaseContinuity {
  readonly continuityId: CONTINUITY_IDS = CONTINUITY_IDS.FOLLOW_THE_LEADER;

  duration: number = 8;

  leaderPath: FlowBeat[] = [];

  humanReadableText: string = '';

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContinuityFollowTheLeader> = {}) {
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
