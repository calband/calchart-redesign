import { BaseCont, CONT_IDS } from "./BaseCont";
import StuntSheetDot from "../StuntSheetDot";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/FlowBeat";
import { diagonalHelper, ewHelper, nsHelper } from "./continuity-util";
import Serializable from "../util/Serializable";

export enum ETF_DYNAMIC_TYPES {
  EWNS = "EW/NS",
  NSEW = "NS/EW",
  DFM = "D/FM",
  FMD = "FM/D",
}

/**
 * Move in a combination of directions until reach the end position. Can only
 * move in an eight-to-five step. Accepts HS, MM, and Military.
 * - EW/NS FMHS
 * - NS/EW FMHS
 * - DHS/FMHS
 * - FMHS/DHS
 *
 * @property eightToFiveType - Determines the order of directions to move in
 */
export default class ContETFDynamic
  extends Serializable<ContETFDynamic>
  implements BaseCont
{
  readonly continuityId: CONT_IDS = CONT_IDS.ETF_DYNAMIC;

  duration = 0;

  humanReadableText = "";

  eightToFiveType: ETF_DYNAMIC_TYPES = ETF_DYNAMIC_TYPES.EWNS;

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContETFDynamic> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== "") return this.humanReadableText;

    switch (this.eightToFiveType) {
      case ETF_DYNAMIC_TYPES.EWNS:
        return `EW/NS FM${this.marchType}`;

      case ETF_DYNAMIC_TYPES.NSEW:
        return `NS/EW FM${this.marchType}`;

      case ETF_DYNAMIC_TYPES.DFM:
        return `D${this.marchType}/FM${this.marchType}`;

      case ETF_DYNAMIC_TYPES.FMD:
        return `FM${this.marchType}/D${this.marchType}`;

      default:
        return "Unknown";
    }
  }

  addToFlow(flow: FlowBeat[], endDot?: StuntSheetDot): void {
    if (endDot === undefined) return;

    const lastFlowBeat = flow[flow.length - 1];
    const [endX, endY]: [number, number] = [endDot.x, endDot.y];
    let offsetX: number = endX - lastFlowBeat.x;
    let offsetY: number = endY - lastFlowBeat.y;
    let diagOffsetX: number;
    let diagOffsetY: number;

    if (
      this.eightToFiveType === ETF_DYNAMIC_TYPES.DFM ||
      this.eightToFiveType === ETF_DYNAMIC_TYPES.FMD
    ) {
      const absOffsetX: number = Math.abs(offsetX);
      const absOffsetY: number = Math.abs(offsetY);
      const absDiagOffset: number = Math.min(absOffsetX, absOffsetY);

      diagOffsetX = Math.sign(offsetX) * absDiagOffset;
      diagOffsetY = Math.sign(offsetY) * absDiagOffset;

      offsetX = Math.sign(offsetX) * (absOffsetX - absDiagOffset);
      offsetY = Math.sign(offsetY) * (absOffsetY - absDiagOffset);

      if (this.eightToFiveType === ETF_DYNAMIC_TYPES.DFM) {
        diagonalHelper(flow, diagOffsetX, diagOffsetY, this.marchType);
        offsetX > 0
          ? nsHelper(flow, offsetX, this.marchType)
          : ewHelper(flow, offsetY, this.marchType);
      } else if (this.eightToFiveType === ETF_DYNAMIC_TYPES.FMD) {
        offsetX > 0
          ? nsHelper(flow, offsetX, this.marchType)
          : ewHelper(flow, offsetY, this.marchType);
        diagonalHelper(flow, diagOffsetX, diagOffsetY, this.marchType);
      }
    } else if (this.eightToFiveType === ETF_DYNAMIC_TYPES.EWNS) {
      ewHelper(flow, offsetY, this.marchType);
      nsHelper(flow, offsetX, this.marchType);
    } else if (this.eightToFiveType === ETF_DYNAMIC_TYPES.NSEW) {
      nsHelper(flow, offsetX, this.marchType);
      ewHelper(flow, offsetY, this.marchType);
    }
  }
}
