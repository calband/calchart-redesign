import BaseCont, { CONT_IDS } from "./BaseCont";
import StuntSheetDot from "../StuntSheetDot";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/FlowBeat";
import Serializable from "../util/Serializable";

/**
 * Similar to follow the leader, but the leader also follows the tail.
 */
export default class ContCounterMarch
  extends Serializable<ContCounterMarch>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.COUNTER_MARCH;

  duration = 0;

  humanReadableText = "";

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContCounterMarch> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== "") return this.humanReadableText;
    // TODO: Implement
    return "";
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  addToFlow(flow: FlowBeat[], endDot?: StuntSheetDot): void {
    // TODO: Implement
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
