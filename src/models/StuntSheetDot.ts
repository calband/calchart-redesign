import { FlowBeat } from './util/types';

/**
 * Defines the position and direction of a marcher for a specific StuntSheet.
 */
export default class StuntSheetDot {
  x: number;

  y: number;

  dotLabelIndex: number|null;

  direction: number;

  dotTypeIndex: number;

  cachedFlow: FlowBeat[]|null;

  constructor(x: number, y: number, dotLabelIndex?: number) {
    this.x = x;
    this.y = y;
    this.dotLabelIndex = dotLabelIndex !== undefined ? dotLabelIndex : null;
    this.direction = 0;
    this.dotTypeIndex = 0;
    this.cachedFlow = null;
  }
}
