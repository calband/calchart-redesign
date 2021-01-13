import BaseCont, { CONT_IDS } from "./BaseCont";
import { DIRECTIONS, MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/FlowBeat";
import Serializable from "../util/Serializable";

/**
 * Move in a specified direction for a duration. Can only move in an
 * eight-to-five step. Accepts HS, MM, and Military.
 * - FMHS 8 E
 * - FMMM 4 SW
 *
 * @property marchingDirection - Which direction the marcher is moving
 * @property facingDirection - Which direction the marcher is facing
 */
export default class ContETFStatic
  extends Serializable<ContETFStatic>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.ETF_STATIC;

  duration = 8;

  marchingDirection: DIRECTIONS = DIRECTIONS.E;

  facingDirection: DIRECTIONS = DIRECTIONS.E;

  humanReadableText = "";

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContETFStatic> = {}) {
    super();
    if (json.facingDirection === undefined) {
      json.facingDirection = json.marchingDirection;
    }
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== "") return this.humanReadableText;
    const marchingDirectionText: string = DIRECTIONS[this.marchingDirection];
    const facingDirectionText: string = DIRECTIONS[this.facingDirection];
    if (this.marchingDirection === this.facingDirection) {
      return `FM${this.marchType} ${this.duration} ${marchingDirectionText}`;
    } else {
      return `FM${this.marchType} ${this.duration} ${marchingDirectionText} FACING ${facingDirectionText}`;
    }
  }

  addToFlow(flow: FlowBeat[]): void {
    const dx = Math.sign(
      Math.round(Math.cos((this.marchingDirection / 180) * Math.PI))
    );
    const dy = Math.sign(
      Math.round(Math.sin((this.marchingDirection / 180) * Math.PI))
    );

    const lastFlowBeat = flow[flow.length - 1];
    lastFlowBeat.direction = this.facingDirection;
    lastFlowBeat.marchType = this.marchType;

    for (let beat = 1; beat <= this.duration; beat += 1) {
      const flowBeat: FlowBeat = {
        x: lastFlowBeat.x + dx * beat,
        y: lastFlowBeat.y + dy * beat,
        direction: this.facingDirection,
        marchType: this.marchType,
      };
      flow.push(flowBeat);
    }
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
