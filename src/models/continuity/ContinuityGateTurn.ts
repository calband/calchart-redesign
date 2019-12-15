import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Deserializable from '../util/Deserializable';

/**
 * Defines a gate turn continuity.
 * 
 * @property centerPoints - [x, y] values for the center of each gate turn group
 */
export default class ContinuityGateTurn extends Deserializable<ContinuityGateTurn> implements BaseContinuity {
  readonly continuityId: CONTINUITY_IDS = CONTINUITY_IDS.GATE_TURN;

  duration: number = 8;

  centerPoints: [number, number][] = [];

  humanReadableText: string = '';

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContinuityGateTurn> = {}) {
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
