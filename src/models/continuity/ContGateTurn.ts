import BaseCont, { CONT_IDS } from "./BaseCont";
import StuntSheetDot from "../StuntSheetDot";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/types";
import Serializable from "../util/Serializable";
import { startPositionHelper } from "./continuity-util";
import { center } from 'svg-pan-zoom';

/**
 * Defines a gate turn continuity.
 *
 * @property centerPoint - The center of the gate turn
 * @property angle - the total angle of the gate turn
 */
export default class ContGateTurn
  extends Serializable<ContGateTurn>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.GATE_TURN;

  duration = 8;

  centerPoint: [number, number] = [0, 0];
  angle: number = 180;

  humanReadableText = "";

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContGateTurn> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== "") return this.humanReadableText;
    const rotation: String = Math.sign(this.angle) == 1 ? "CW" : "CCW";
    return `GT${this.marchType} ${this.duration} COUNTS ${Math.abs(this.angle)} DEGREES ${rotation} ABOUT POINT [${this.centerPoint}]`
  }

  addToFlow(
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot
  ): void {
    const [startx, starty]: [number, number] = startPositionHelper(flow, startDot);
    const [dx, dy]: [number, number] = [startx-this.centerPoint[0], starty-this.centerPoint[1]]
    if (dx != 0 || dy != 0) {
      for (let beat = 1; beat <= this.duration; beat += 1) {
        const theta: number = (beat - 1)/this.duration * this.angle * Math.PI / 180;
        const x: number = dx*Math.cos(theta) + dy*Math.sin(theta);
        const y: number = dx*Math.sin(theta) + dy*Math.cos(theta);2
        const direction: number = ((Math.sign(this.angle) > 0 ? 180 : 360) - Math.atan2(-y, x) * 180 / Math.PI) % 360;

        const flowBeat: FlowBeat = {
          x: x + this.centerPoint[0],
          y: y + this.centerPoint[1],
          marchType: this.marchType,
          direction: direction,
        };
        flow.push(flowBeat);
      }
    } else {
      // We still want the person on the center point to rotate the same way as everyone else
      for (let beat = 1; beat <= this.duration; beat += 1) {
        const theta: number = (beat - 1)/this.duration * this.angle * Math.PI / 180;
        const direction: number = ((Math.sign(this.angle) > 0 ? 180 : 360) + theta * 180 / Math.PI) % 360;
        const flowBeat: FlowBeat = {
          x: this.centerPoint[0],
          y: this.centerPoint[1],
          marchType: this.marchType,
          direction: direction,
        };
        flow.push(flowBeat);
      }
    }
  }
}
