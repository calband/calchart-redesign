import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES, DIRECTION_TO_DEGREES } from '../util/constants';
import { FlowBeat } from '../util/types';

/**
 * Move in a specified direction for a duration. Can only move in an eight-to-five step.
 * Accepts HS, MM, and Military.
 * - FMHS 8 E
 * - FMMM 4 SW
 * 
 * @property marchingDirection - Which direction the marcher is moving
 * @property facingDirection   - Which direction the marcher is facing during the movement. If undefined, will be marchingDirection.
 */
export default class ContinuityEightToFiveStatic implements BaseContinuity {
  continuityId: CONTINUITY_IDS;

  duration: number;

  marchingDirection: DIRECTION_TO_DEGREES;

  facingDirection: DIRECTION_TO_DEGREES;

  humanReadableText: string;

  marchType: MARCH_TYPES;

  constructor(duration: number, marchType: MARCH_TYPES, marchingDirection: DIRECTION_TO_DEGREES, facingDirection?: DIRECTION_TO_DEGREES) {
    this.continuityId = CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC;
    this.duration = duration;
    this.marchingDirection = marchingDirection;
    this.facingDirection = facingDirection === undefined ? marchingDirection : facingDirection;
    this.humanReadableText = '';
    this.marchType = marchType;
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== '') return this.humanReadableText;
    // TODO: Implement
    return '';
  }

  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    if (endDot === undefined) return;
    // TODO: Implement
  }
}
