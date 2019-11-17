import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import { startPositionHelper, ewHelper, nsHelper, diagonalHelper } from './continuity-util';

export enum EIGHT_TO_FIVE_DYNAMIC_TYPES {
  EWNS,
  NSEW,
  DFM,
  FMD,
}

/**
 * Move in a combination of directions until reach the end position. Can only move in an eight-to-five step.
 * Accepts HS, MM, and Military.
 * - EW/NS FMHS
 * - NS/EW FMHS
 * - DHS/FMHS
 * - FMHS/DHS
 */
export default class ContinuityEightToFiveDynamic implements BaseContinuity {
  continuityId: CONTINUITY_IDS;

  duration: number;

  humanReadableText: string;

  eightToFiveType: EIGHT_TO_FIVE_DYNAMIC_TYPES;

  marchType: MARCH_TYPES;

  constructor(eightToFiveType: EIGHT_TO_FIVE_DYNAMIC_TYPES, marchType: MARCH_TYPES) {
    this.continuityId = CONTINUITY_IDS.EIGHT_TO_FIVE_DYNAMIC;
    this.duration = 0;
    this.humanReadableText = '';
    this.eightToFiveType = eightToFiveType;
    this.marchType = marchType;
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== '') return this.humanReadableText;

    switch (this.eightToFiveType) {
      case EIGHT_TO_FIVE_DYNAMIC_TYPES.EWNS:
        return `EW/NS FM${this.marchType}`;

      case EIGHT_TO_FIVE_DYNAMIC_TYPES.NSEW:
        return `NS/EW FM${this.marchType}`;

      case EIGHT_TO_FIVE_DYNAMIC_TYPES.DFM:
        return `D${this.marchType}/FM${this.marchType}`;

      case EIGHT_TO_FIVE_DYNAMIC_TYPES.FMD:
        return `FM${this.marchType}/D${this.marchType}`

      default:
        return 'Unknown';
    }
  }

  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    if (endDot === undefined) return;

    let [startX, startY]: [number, number] = startPositionHelper(flow, startDot);
    const [endX, endY]: [number, number] = [endDot.x, endDot.y];
    let offsetX: number = endX - startX;
    let offsetY: number = endY - startY;
    let diagOffsetX: number;
    let diagOffsetY: number;
    
    if (this.eightToFiveType === EIGHT_TO_FIVE_DYNAMIC_TYPES.DFM || this.eightToFiveType === EIGHT_TO_FIVE_DYNAMIC_TYPES.FMD) {
      const absOffsetX: number = Math.abs(offsetX);
      const absOffsetY: number = Math.abs(offsetY);
      const absDiagOffset: number = Math.min(absOffsetX, absOffsetY);

      diagOffsetX = Math.sign(offsetX) * absDiagOffset;
      diagOffsetY = Math.sign(offsetY) * absDiagOffset;

      offsetX = Math.sign(offsetX) * (absOffsetX - absDiagOffset);
      offsetY = Math.sign(offsetY) * (absOffsetY - absDiagOffset);

      if (this.eightToFiveType === EIGHT_TO_FIVE_DYNAMIC_TYPES.DFM) {
        [startX, startY] = diagonalHelper(flow, startX, startY, diagOffsetX, diagOffsetY, this.marchType);
        [startX, startY] = offsetX > 0 ? nsHelper(flow, startX, startY, offsetX, this.marchType) : ewHelper(flow, startX, startY, offsetY, this.marchType);
      } else if (this.eightToFiveType === EIGHT_TO_FIVE_DYNAMIC_TYPES.FMD) {
        [startX, startY] = offsetX > 0 ? nsHelper(flow, startX, startY, offsetX, this.marchType) : ewHelper(flow, startX, startY, offsetY, this.marchType);
        [startX, startY] = diagonalHelper(flow, startX, startY, diagOffsetX, diagOffsetY, this.marchType);
      }

    } else if (this.eightToFiveType === EIGHT_TO_FIVE_DYNAMIC_TYPES.EWNS) {
      [startX, startY] = ewHelper(flow, startX, startY, offsetY, this.marchType);
      [startX, startY] = nsHelper(flow, startX, startY, offsetX, this.marchType);
    } else if (this.eightToFiveType === EIGHT_TO_FIVE_DYNAMIC_TYPES.NSEW) {
      [startX, startY] = nsHelper(flow, startX, startY, offsetX, this.marchType);
      [startX, startY] = ewHelper(flow, startX, startY, offsetY, this.marchType);
    }
  }
}
