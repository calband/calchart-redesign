import Field from './Field';
import StuntSheet from './StuntSheet';
import StuntSheetDot from './StuntSheetDot';
import BaseContinuity from './continuity/BaseContinuity';
import { FlowBeat } from './util/types';
import Deserializable from './util/Deserializable';

// Upon making show metadata changes that break previous versions, please increment.
const METADATA_VERSION: number = 1;

/**
 * Defines all metadata to edit, render, and animate a Calchart show.
 * 
 * @property metadataVersion - Upon loading the show, determines what migrations are needed to make the show compatible with future CalChart versions
 * @property title           - Used to categorize saved shows
 * @property dotLabels       - A list of names used for each dot. Ex. ['A0', 'A1', ...]
 * @property field           - Defines the sizing of the field that is being marched on
 * @property stuntSheets     - The set of all StuntSheet objects
 */
export default class Show extends Deserializable<Show> {
  metadataVersion: number = METADATA_VERSION;

  title: string = 'Example Show';

  dotLabels: string[] = [];

  field: Field = new Field();

  stuntSheets: StuntSheet[] = [new StuntSheet()];

  constructor(showJson?: Partial<Show>) {
    super();
    if (showJson !== undefined) {
      if (showJson.field !== undefined) {
        showJson.field = new Field(showJson.field);
      }
      if (showJson.stuntSheets !== undefined) {
        showJson.stuntSheets = showJson.stuntSheets.map((stuntSheet: StuntSheet) => {
          return new StuntSheet(stuntSheet);
        });
      }
    }
    this.fromJson(showJson);
  }

  /**
   * For each StuntSheetDot in the specified StuntSheet, calculate and store the flow based on it's continuities in stuntSheetDot.cachedFlow.
   */
  generateFlows(stuntSheetIndex: number): void {
    if (stuntSheetIndex < 0 || stuntSheetIndex + 1 >= this.stuntSheets.length) {
      throw `stuntSheetIndex (${stuntSheetIndex}) is invalid with stuntsheet length ${this.stuntSheets.length}`;
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
