import BaseCont, { CONT_IDS } from "./BaseCont";
import StuntSheetDot from "../StuntSheetDot";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/FlowBeat";
import Serializable from "../util/Serializable";
import { startPositionHelper } from "./continuity-util";

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

  centerPoints: Map<number, [number, number]> = new Map<
    number,
    [number, number]
  >();

  angle = 180;

  humanReadableText = "";

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContGateTurn> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== "") return this.humanReadableText;
    const rotation: string = Math.sign(this.angle) === 1 ? "CW" : "CCW";
    return `GT${this.marchType} ${this.duration} COUNTS ${Math.abs(
      this.angle
    )} DEGREES ${rotation}`;
  }

  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot): void {
    const [startx, starty]: [number, number] = startPositionHelper(
      flow,
      startDot
    );
    let centerPoint: [number, number] | undefined = this.centerPoints.get(
      startDot.id
    );
    if (!centerPoint) {
      centerPoint = [0, 0];
    }
    // Find the relative coordinates to the center
    const [dx, dy]: [number, number] = [
      startx - centerPoint[0],
      starty - centerPoint[1],
    ];
    if (dx !== 0 || dy !== 0) {
      for (let beat = 1; beat <= this.duration; beat += 1) {
        // Split theta up into duration equal parts and convert to radians
        const theta: number =
          (((beat - 1) / this.duration) * this.angle * Math.PI) / 180;
        // Rotation matrix transfomration here
        // Because y-axis is positive going down and angle is measured clockwise,
        // it is the same matrix transformation as a regular rotation.
        const x: number = dx * Math.cos(theta) - dy * Math.sin(theta);
        const y: number = dx * Math.sin(theta) + dy * Math.cos(theta);
        // Direction is a phase shift on the negative rotation
        // Phase change depends on the sign of the angle, wither 180 or 360
        const direction: number =
          ((Math.sign(this.angle) > 0 ? 180 : 360) -
            (Math.atan2(-y, x) * 180) / Math.PI) %
          360;

        const flowBeat: FlowBeat = {
          x: x + centerPoint[0],
          y: y + centerPoint[1],
          marchType: this.marchType,
          direction: direction,
        };
        flow.push(flowBeat);
      }
    } else {
      // We still want the person on the center point to rotate the same way as everyone else
      for (let beat = 1; beat <= this.duration; beat += 1) {
        const theta: number =
          (((beat - 1) / this.duration) * this.angle * Math.PI) / 180;
        const direction: number =
          ((Math.sign(this.angle) > 0 ? 180 : 360) + (theta * 180) / Math.PI) %
          360;
        const flowBeat: FlowBeat = {
          x: centerPoint[0],
          y: centerPoint[1],
          marchType: this.marchType,
          direction: direction,
        };
        flow.push(flowBeat);
      }
    }
  }
}
