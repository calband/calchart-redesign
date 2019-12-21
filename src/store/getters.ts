import { CalChartState } from '.';
import StuntSheet from '@/models/StuntSheet';
import { GetterTree } from 'vuex';
import StuntSheetDot from '@/models/StuntSheetDot';

const getters: GetterTree<CalChartState, CalChartState> = {
  // Show
  getShowTitle: (state): string => state.show.title,
  getCurrentSheet: (state): number => state.show.currentSheet,
  getNumberOfSheets: (state): number =>
    state.show.stuntSheets.length,

  // Show -> Field
  getFrontHashOffsetY: (state): number =>
    state.show.field.frontHashOffsetY,
  getBackHashOffsetY: (state): number =>
    state.show.field.backHashOffsetY,
  getMiddleOfField: (state): number =>
    state.show.field.middleOfField,

  // Show -> StuntSheet
  getSelectedStuntSheet: (state): StuntSheet =>
    state.show.stuntSheets[state.selectedSS],
  getDots(state): StuntSheetDot[] {
    if (state.show.stuntSheets.length === 0) {
      return [];
    }
    return state.show.stuntSheets[state.show.currentSheet].stuntSheetDots;
  },
};

export default getters;
