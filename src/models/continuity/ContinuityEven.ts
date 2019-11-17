import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import StuntSheetDot from '../StuntSheetDot';

/**
 * Moves in even steps for the entirety of the specified duration to the end position.
 * Accepts HS, MM, and Military.
 */
export default class ContinuityEven implements BaseContinuity {
  continuityId: CONTINUITY_IDS;

  duration: number;

  marchType: MARCH_TYPES;

  humanReadableText: string;

  constructor(duration: number, marchType: MARCH_TYPES) {
    this.continuityId = CONTINUITY_IDS.EVEN;
    this.duration = duration;
    this.marchType = marchType;
    this.humanReadableText = '';
  }

  getHumanReadableText(): string {
    return this.humanReadableText === undefined ? `Even ${this.duration}` : this.humanReadableText;
  }

  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    if (endDot === undefined) return;
    // TODO: Implement
  }
}