import ContEven from "./ContEven";
import BaseCont, { CONT_IDS } from "./BaseCont";
import ContCounterMarch from "./ContCounterMarch";
import ContInPlace from "./ContInPlace";
import ContETFStatic from "./ContETFStatic";
import ContETFDynamic from "./ContETFDynamic";
import ContFollowLeader from "./ContFollowLeader";
import ContGateTurn from "./ContGateTurn";
import ContStepTwo from "./ContStepTwo";

/**
 * Factory function for creating a new continuity
 *
 * @param offsetX    - How many steps to march. Positive is north, negative is
 *                     south.
 * @param direction? - To enforce a direction to face, set this parameter. If
 *                     undefined, the marcher will face the direction they are
 *                     marching.
 */
export const ContFactory = (whichCont: CONT_IDS): BaseCont => {
  switch (whichCont) {
    case CONT_IDS.IN_PLACE:
      return new ContInPlace();
    case CONT_IDS.ETF_STATIC:
      return new ContETFStatic();
    case CONT_IDS.ETF_DYNAMIC:
      return new ContETFDynamic();
    case CONT_IDS.EVEN:
      return new ContEven();
    case CONT_IDS.FOLLOW_LEADER:
      return new ContFollowLeader();
    case CONT_IDS.COUNTER_MARCH:
      return new ContCounterMarch();
    case CONT_IDS.GATE_TURN:
      return new ContGateTurn();
    case CONT_IDS.STEP_TWO:
      return new ContStepTwo();
  }
};
