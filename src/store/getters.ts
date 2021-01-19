import { CalChartState } from ".";
import StuntSheet from "@/models/StuntSheet";
import { GetterTree } from "vuex";
import Show from "@/models/Show";
import BaseCont from "@/models/continuity/BaseCont";

const getters: GetterTree<CalChartState, CalChartState> = {
  // Show
  getShowTitle: (state): string => state.show.title,
  getShow: (state): Show => state.show,

  // Show -> Dots
  getDotLabels: (state): string[] => state.show.dotLabels,

  // Show -> Field
  getFrontHashOffsetY: (state): number => state.show.field.frontHashOffsetY,
  getBackHashOffsetY: (state): number => state.show.field.backHashOffsetY,
  getMiddleOfField: (state): number => state.show.field.middleOfField,

  // Show -> StuntSheet
  getSelectedStuntSheet: (state): StuntSheet =>
    state.show.stuntSheets[state.selectedSS],
  getContinuity: (state) => (
    dotTypeIndex: number,
    continuityIndex: number
  ): BaseCont =>
    state.show.stuntSheets[state.selectedSS].dotTypes[dotTypeIndex][
      continuityIndex
    ],
};

export default getters;
