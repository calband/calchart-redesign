import { stateType } from './types';

export default {
  // Show
  setShowTitle(state: stateType, title: string) {
    state.show.title = title;
  },

  setAddSheetAsCopyOf(state: stateType, copyWhich: number) {
   state.show.addSheetAsCopyOf(copyWhich);
  },

  // Show -> Field
  setFrontHashOffsetY(state: stateType, offsetY: number) {
    state.show.field.frontHashOffsetY = offsetY;
  },
  setBackHashOffsetY(state: stateType, offsetY: number) {
    state.show.field.backHashOffsetY = offsetY;
  },
  setMiddleOfField(state: stateType, middle: number) {
    state.show.field.middleOfField = middle;
  },

  // View Settings
  setFourStepGrid(state: stateType, enabled: boolean) {
    state.fourStepGrid = enabled;
  },
};
