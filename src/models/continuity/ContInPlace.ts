import BaseCont, { CONT_IDS } from "./BaseCont";
import { DIRECTIONS, MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/FlowBeat";
import Serializable from "../util/Serializable";

/**
 * Stay in the same position for the specified duration, direction, and march
 * type.
 *  - MTHS 8 E
 *  - MTMM 4 SW
 *  - [Close N]
 *  - Vamp E
 */
export default class ContInPlace
  extends Serializable<ContInPlace>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.IN_PLACE;

  duration = 0;

  direction: DIRECTIONS = DIRECTIONS.E;

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  humanReadableText = "";

  constructor(json: Partial<ContInPlace> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== "") return this.humanReadableText;

    const directionText: string = DIRECTIONS[this.direction];

    let prefix = "";
    if (
      this.marchType === MARCH_TYPES.HS ||
      this.marchType === MARCH_TYPES.MINI_MILITARY
    ) {
      prefix = "MT";
    }

    return this.duration === 0
      ? `[${prefix}${this.marchType} ${directionText}]`
      : `${prefix}${this.marchType} ${this.duration} ${directionText}`;
  }

  addToFlow(flow: FlowBeat[]): void {
    const lastFlowBeat = flow[flow.length - 1];
    lastFlowBeat.direction = this.direction;
    lastFlowBeat.marchType = this.marchType;
    const flowBeat: FlowBeat = { ...lastFlowBeat };
    for (let beat = 1; beat <= this.duration; beat += 1) {
      flow.push(flowBeat);
    }
  }
}
