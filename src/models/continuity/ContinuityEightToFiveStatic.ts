import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { DIRECTION_TO_DEGREES, MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Serializable from '../util/Serializable';

/**
 * Move in a specified direction for a duration. Can only move in an eight-to-five step.
 * Accepts HS, MM, and Military.
 * - FMHS 8 E
 * - FMMM 4 SW
 *
 * @property marchingDirection - Which direction the marcher is moving
 * @property facingDirection   - Which direction the marcher is facing during the movement. If undefined, will be marchingDirection.
 */
export default class ContinuityEightToFiveStatic extends Serializable<ContinuityEightToFiveStatic> implements BaseContinuity {
  readonly continuityId: CONTINUITY_IDS = CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC;

  duration: number = 8;

  marchingDirection: DIRECTION_TO_DEGREES = DIRECTION_TO_DEGREES.E;

  facingDirection: DIRECTION_TO_DEGREES = DIRECTION_TO_DEGREES.E;

  humanReadableText: string = '';

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContinuityEightToFiveStatic> = {}) {
    super();
    if (json.facingDirection === undefined) {
      json.facingDirection = json.marchingDirection;
    }
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== '') return this.humanReadableText;
    // TODO: Implement
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    // TODO: Implement
  }
}
