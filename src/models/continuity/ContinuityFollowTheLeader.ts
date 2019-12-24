import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Serializable from '../util/Serializable';

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 *
 * @property leaderPath - Defines the flow that the leader will take
 */
export default class ContinuityFollowTheLeader extends Serializable<ContinuityFollowTheLeader> implements BaseContinuity {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    // TODO: Implement
  }
}
