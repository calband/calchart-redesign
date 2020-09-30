import BaseCont, { CONT_IDS } from './BaseCont'
import StuntSheetDot from '../StuntSheetDot'
import { MARCH_TYPES } from '../util/constants'
import { FlowBeat } from '../util/types'
import Serializable from '../util/Serializable'

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 *
 * @property leaderPath - Defines the flow that the leader will take
 */
export default class ContFollowLeader extends Serializable<ContFollowLeader>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.FOLLOW_LEADER;

  duration = 8;

  leaderPath: FlowBeat[] = [];

  humanReadableText = '';

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor (json: Partial<ContFollowLeader> = {}) {
    super()
    this.fromJson(json)
  }

  getHumanReadableText (): string {
    if (this.humanReadableText !== '') return this.humanReadableText
    // TODO: Implement
    return ''
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  addToFlow (
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot
  ): void {
    // TODO: Implement
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
