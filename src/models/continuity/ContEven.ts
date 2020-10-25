import BaseCont, { CONT_IDS } from "./BaseCont";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/types";
import { startPositionHelper } from "./continuity-util";
import StuntSheetDot from "../StuntSheetDot";
import Serializable from "../util/Serializable";

/**
 * Moves in even steps for the entirety of the specified duration to the end
 * position. Accepts HS, MM, and Military.
 *
 * - EVEN MARCH HS 16
 * - EVEN MARCH MM 8
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
    return `EVEN MARCH ${this.marchType}`;
  }

  addToFlow(
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot
  ): void {
    if (endDot === undefined) return;
    const [endX, endY]: [number, number] = [endDot.x, endDot.y];
    const [startX, startY]: [number, number] = startPositionHelper(
      flow,
      startDot
    );
    const [deltaX, deltaY]: [number, number] = [
      (endX - startX) / this.duration,
      (endY - startY) / this.duration,
    ];
    const dir =
      (Math.atan2(deltaY, deltaX) * 180) / Math.PI + (deltaY < 0 ? 360 : 0);
    for (let beat = 0; beat < this.duration; beat += 1) {
      const flowBeat: FlowBeat = {
        x: startX + deltaX * beat,
        y: startY + deltaY * beat,
        direction: dir,
        marchType: this.marchType,
      };
      flow.push(flowBeat);
    }
  }
}
