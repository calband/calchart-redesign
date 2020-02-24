import BaseCont, { CONT_IDS } from './BaseCont';
import StuntSheetDot from '../StuntSheetDot';
import { MARCH_TYPES } from '../util/constants';
import { FlowBeat } from '../util/types';
import Serializable from '../util/Serializable';

/**
 * Defines a gate turn continuity.
 *
 * @property centerPoints - [x, y] values for the center of each gate turn
 * group
 */
export default class ContGateTurn extends Serializable<ContGateTurn>
  implements BaseCont {
  readonly continuityId: CONT_IDS = CONT_IDS.GATE_TURN;

  duration = 8;

  centerPoints: [number, number][] = [];

  humanReadableText = '';

  marchType: MARCH_TYPES = MARCH_TYPES.HS;

  constructor(json: Partial<ContGateTurn> = {}) {
    super();
    this.fromJson(json);
  }

  getHumanReadableText(): string {
    if (this.humanReadableText !== '') return this.humanReadableText;
    // TODO: Implement
    return '';
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  addToFlow(
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot,
  ): void {
    // TODO: Implement
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}
