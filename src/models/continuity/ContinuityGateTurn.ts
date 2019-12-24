import BaseContinuity, { CONTINUITY_IDS } from './BaseContinuity';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Serializable from '../util/Serializable';

/**
 * Defines a gate turn continuity.
 *
 * @property centerPoints - [x, y] values for the center of each gate turn group
 */
export default class ContinuityGateTurn extends Serializable<ContinuityGateTurn> implements BaseContinuity {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToFlow(flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot): void {
    // TODO: Implement
  }
}
