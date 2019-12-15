import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES, DIRECTION_TO_DEGREES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Deserializable from '../util/Deserializable';

/**
 * Move in a specified direction for a duration. Can only move in an eight-to-five step.
 * Accepts HS, MM, and Military.
 * - FMHS 8 E
 * - FMMM 4 SW
 * 
 * @property marchingDirection - Which direction the marcher is moving
 * @property facingDirection   - Which direction the marcher is facing during the movement. If undefined, will be marchingDirection.
 */
export default class ContinuityEightToFiveStatic extends Deserializable<ContinuityEightToFiveStatic> implements BaseContinuity {
  continuityId: CONTINUITY_IDS = CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC;

  duration: number = 8;

  marchingDirection: DIRECTION_TO_DEGREES = DIRECTION_TO_DEGREES.E;

  facingDirection: DIRECTION_TO_DEGREES = DIRECTION_TO_DEGREES.E;

  humanReadableText: string = '';

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json?: Partial<ContinuityEightToFiveStatic>) {
    super();
    if (json !== undefined) {
      if (json.facingDirection === undefined) {
        json.facingDirection = json.marchingDirection;
      }
    }
    this.fromJson(json);
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
