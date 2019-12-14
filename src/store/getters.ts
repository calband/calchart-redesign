import { stateType } from './types';

export default {
  // Show
  getShowTitle: (state: stateType) => state.show.title,
  getNumberOfSheets: (state: stateType) => state.show.stuntSheets.length,

  // Show -> Field
  getFrontHashOffsetY: (state: stateType) => state.show.field.frontHashOffsetY,
  getBackHashOffsetY: (state: stateType) => state.show.field.backHashOffsetY,
  getMiddleOfField: (state: stateType) => state.show.field.middleOfField,
};
