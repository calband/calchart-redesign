import { stateType } from './types';

export default {
  // Show
  setShowTitle(state: stateType, title: string) {
    state.show.title = title;
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

  // Which sheet to view
  setCurrentEditSheet(state: stateType, which: number) {
    state.show.currentSheet = which;
  },
  setCurrentEditSheetNext(state: stateType) {
    if (state.show.currentSheet < (state.show.stuntSheets.length-1)) {
      ++state.show.currentSheet;
    }
  },
  setCurrentEditSheetPrevious(state: stateType) {
    if (state.show.currentSheet > 0) {
      --state.show.currentSheet;
    }
  },
};
