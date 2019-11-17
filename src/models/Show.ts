import Field from './Field';
import StuntSheet from './StuntSheet';
import StuntSheetDot from './StuntSheetDot';
import BaseContinuity from './continuity/BaseContinuity';
import { FlowBeat } from './util/types';

// Upon making show metadata changes that break previous versions, please increment.
const METADATA_VERSION: number = 1;

/**
 * Defines all metadata to edit, render, and animate a Calchart show.
 */
export default class Show {
  metadataVersion: number;

  title: string;

  dotLabels: string[];

  field: Field;

  stuntSheets: StuntSheet[];

  constructor() {
    this.metadataVersion = METADATA_VERSION;
    this.title = 'Example Show';
    this.dotLabels = [];
    this.field = new Field();
    this.stuntSheets = [new StuntSheet()];
  }

  /**
   * For each StuntSheetDot in the specified StuntSheet, calculate and store the flow
   * based on it's continuities in stuntSheetDot.cachedFlow.
   */
  generateFlows(stuntSheetIndex: number): void {
    if (stuntSheetIndex >= this.stuntSheets.length) {
      throw `stuntSheetIndex (${stuntSheetIndex}) is larger than the length of stuntSheets (${this.stuntSheets.length})`;
    }

    const startSS: StuntSheet = this.stuntSheets[stuntSheetIndex];
    const endSS: StuntSheet = this.stuntSheets[stuntSheetIndex + 1];

    startSS.stuntSheetDots.map((startDot: StuntSheetDot) => {
      const endDot: StuntSheetDot|undefined = startDot.dotLabelIndex === null
        ? undefined
        : endSS.stuntSheetDots.find((dot: StuntSheetDot) => startDot.dotLabelIndex === dot.dotLabelIndex);

      let flow: FlowBeat[] = [];
      const continuities: BaseContinuity[] = startSS.dotTypes[startDot.dotTypeIndex];

      continuities.forEach((continuity: BaseContinuity) => {
        continuity.addToFlow(flow, startDot, endDot);
      });

      startDot.cachedFlow = flow;
    });
  }
}
