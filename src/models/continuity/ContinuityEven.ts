import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import StuntSheetDot from '../StuntSheetDot';
import Deserializable from '../util/Deserializable';

/**
 * Moves in even steps for the entirety of the specified duration to the end position.
 * Accepts HS, MM, and Military.
 * 
 * - Even HS 16
 * - Even MM 8
 */
export default class ContinuityEven extends Deserializable<ContinuityEven> implements BaseContinuity {
  readonly continuityId: CONTINUITY_IDS = CONTINUITY_IDS.EVEN;

  duration: number = 8;

  marchType: MARCH_TYPES = MARCH_TYPES.MINI_MILITARY;

  humanReadableText: string = '';

  constructor(json: Partial<ContinuityEven> = {}) {
    super();
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