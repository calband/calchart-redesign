import BaseCont, { CONT_IDS } from './BaseCont'
import ContInPlace from './ContInPlace'
import ContETFDynamic from './ContETFDynamic'
import ContEven from './ContEven'
import ContETFStatic from './ContETFStatic'
import ContFollowLeader from './ContFollowLeader'
import ContCounterMarch from './ContCounterMarch'
import ContGateTurn from './ContGateTurn'
import ContStepTwo from './ContStepTwo'

/**
 * Helper function to initialize a continuity based off it's id
 */
export const loadContinuity = (continuityJson: BaseCont): BaseCont => {
  switch (continuityJson.continuityId) {
    case CONT_IDS.IN_PLACE:
      return new ContInPlace(continuityJson)

    case CONT_IDS.ETF_STATIC:
      return new ContETFStatic(continuityJson)

    case CONT_IDS.ETF_DYNAMIC:
      return new ContETFDynamic(continuityJson)

    case CONT_IDS.EVEN:
      return new ContEven(continuityJson)

    case CONT_IDS.FOLLOW_LEADER:
      return new ContFollowLeader(continuityJson)

    case CONT_IDS.COUNTER_MARCH:
      return new ContCounterMarch(continuityJson)

    case CONT_IDS.GATE_TURN:
      return new ContGateTurn(continuityJson)

    case CONT_IDS.STEP_TWO:
      return new ContStepTwo(continuityJson)

    default:
      throw new Error(`Continuity id ${continuityJson.continuityId} is not recognized`)
  }
}
