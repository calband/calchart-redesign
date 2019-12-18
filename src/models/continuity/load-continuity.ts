import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import ContinuityInPlace from './ContinuityInPlace';
import ContinuityEightToFiveDynamic from './ContinuityEightToFiveDynamic';
import ContinuityEven from './ContinuityEven';
import ContinuityEightToFiveStatic from './ContinuityEightToFiveStatic';
import ContinuityFollowTheLeader from './ContinuityFollowTheLeader';
import ContinuityCounterMarch from './ContinuityCounterMarch';
import ContinuityGateTurn from './ContinuityGateTurn';
import ContinuityStepTwo from './ContinuityStepTwo';

/**
 * Helper function to initialize a continuity based off it's id
 */
export const loadContinuity = (continuityJson: BaseContinuity): BaseContinuity => {
  switch (continuityJson.continuityId) {
    case CONTINUITY_IDS.IN_PLACE:
      return new ContinuityInPlace(continuityJson);

    case CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC:
      return new ContinuityEightToFiveStatic(continuityJson);
    
    case CONTINUITY_IDS.EIGHT_TO_FIVE_DYNAMIC:
      return new ContinuityEightToFiveDynamic(continuityJson);
    
    case CONTINUITY_IDS.EVEN:
      return new ContinuityEven(continuityJson);

    case CONTINUITY_IDS.FOLLOW_THE_LEADER:
      return new ContinuityFollowTheLeader(continuityJson);
    
    case CONTINUITY_IDS.COUNTER_MARCH:
      return new ContinuityCounterMarch(continuityJson);

    case CONTINUITY_IDS.GATE_TURN:
      return new ContinuityGateTurn(continuityJson);

    case CONTINUITY_IDS.STEP_TWO:
      return new ContinuityStepTwo(continuityJson);

    default:
      throw `Continuity id ${continuityJson.continuityId} is not recognized`
  }
}
