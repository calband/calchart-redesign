import { CalChartState } from ".";
import StuntSheet from "@/models/StuntSheet";
import { GetterTree } from "vuex";

const getters: GetterTree<CalChartState, CalChartState> = {
  // Show
  getShowTitle: (state): string => state.show.title,

  // Show -> Field
  getFrontHashOffsetY: (state): number => state.show.field.frontHashOffsetY,
  getBackHashOffsetY: (state): number => state.show.field.backHashOffsetY,
  getMiddleOfField: (state): number => state.show.field.middleOfField,

  // Show -> StuntSheet
  getSelectedStuntSheet: (state): StuntSheet =>
    state.show.stuntSheets[state.selectedSS],
};

export default getters;
