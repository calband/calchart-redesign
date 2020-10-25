import BaseCont, { CONT_IDS } from "./BaseCont";
import StuntSheetDot from "../StuntSheetDot";
import { DIRECTIONS, MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/types";
import Serializable from "../util/Serializable";
import { startPositionHelper } from "./continuity-util";

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

  /* eslint-disable @typescript-eslint/no-unused-vars */
  addToFlow(
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot
  ): void {
    let dx = 0;
    let dy = 0;
    switch (this.marchingDirection) {
      case DIRECTIONS.E: {
        dy = 1;
        break;
      }
      case DIRECTIONS.W: {
        dy = -1;
        break;
      }
      case DIRECTIONS.N: {
        dx = 1;
        break;
      }
      case DIRECTIONS.S: {
        dx = -1;
        break;
      }
    }
    const [x, y]: [number, number] = startPositionHelper(flow, startDot);
    for (let beat = 1; beat <= Math.max(this.duration, 1); beat += 1) {
      const flowBeat: FlowBeat = {
        x: x + dx * (beat - 1),
        y: y + dy * (beat - 1),
        direction: this.facingDirection,
        marchType: this.marchType,
      };
      flow.push(flowBeat);
    }
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
