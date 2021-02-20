import { BaseCont, CONT_IDS } from "./BaseCont";
import StuntSheetDot from "../StuntSheetDot";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/FlowBeat";
import Serializable from "../util/Serializable";

/**
 * Defines the path that the leader takes, which the other bandsmen follow.
 * - Step Two
 *   - FMHS 4 E
 *   - FMHS 4 W
 *   - [MTHS E]
 *
 * @property continuities - Execute this list of continuities after waiting a
 *                          certain amount of time
 */
export default class ContStepTwo
  extends Serializable<ContStepTwo>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.STEP_TWO;

  duration = 8;

  continuities: BaseCont[] = [];

  humanReadableText = "";

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContStepTwo> = {}) {
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
