import BaseCont, { CONT_IDS } from "./BaseCont";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/types";
import StuntSheetDot from "../StuntSheetDot";
import Serializable from "../util/Serializable";

/**
 * Moves in even steps for the entirety of the specified duration to the end
 * position. Accepts HS, MM, and Military.
 *
 * - Even HS 16
 * - Even MM 8
 */
export default class ContEven
  extends Serializable<ContEven>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.EVEN;

  duration = 8;

  marchType: MARCH_TYPES = MARCH_TYPES.MINI_MILITARY;

  humanReadableText = "";

  constructor(json: Partial<ContEven> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== "") return this.humanReadableText;
    // TODO: Implement
    return "";
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  addToFlow(
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot
  ): void {
    // TODO: Implement
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
