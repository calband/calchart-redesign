import BaseCont, { CONT_IDS } from "./BaseCont";
import StuntSheetDot from "../StuntSheetDot";
import { DIRECTIONS, MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/types";
import Serializable from "../util/Serializable";
import {
  ewHelper,
  nsHelper,
  startPositionHelper,
} from "./continuity-util";

/**
 * Move in a specified direction for a duration. Can only move in an
 * eight-to-five step. Accepts HS, MM, and Military.
 * - FMHS 8 E
 * - FMMM 4 SW
 *
 * @property marchingDirection - Which direction the marcher is moving
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
    if (this.humanReadableText !== "") {
      return this.humanReadableText;
    } else {
      return `FM${this.marchType} ${this.duration} ${this.marchingDirection}`
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  addToFlow(
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot
  ): void {
    let [startX, startY]: [number, number] = startPositionHelper(
      flow,
      startDot
    );
    switch (this.marchingDirection) {
      case DIRECTIONS.E: {
        [startX, startY] = ewHelper(
          flow,
          startX,
          startY,
          this.duration,
          this.marchType
        );
        break;
      }
      case DIRECTIONS.W: {
        [startX, startY] = ewHelper(
          flow,
          startX,
          startY,
          -this.duration,
          this.marchType
        );
        break;
      }
      case DIRECTIONS.E: {
        [startX, startY] = nsHelper(
          flow,
          startX,
          startY,
          this.duration,
          this.marchType
        );
        break;
      }
      case DIRECTIONS.E: {
        [startX, startY] = nsHelper(
          flow,
          startX,
          startY,
          -this.duration,
          this.marchType
        );
        break;
      }
    }

    // TODO: Implement
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
