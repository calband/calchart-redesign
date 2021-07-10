import { CalChartState } from ".";
import StuntSheet from "@/models/StuntSheet";
import { GetterTree } from "vuex";
import { BaseCont } from "@/models/continuity/BaseCont";

const getters: GetterTree<CalChartState, CalChartState> = {
  // Show
  getShowTitle: (state): string => state.show.title,

  // Show -> Beat
  getBeat: (state): number => state.show.beat,

  // Show -> Dots
  getDotLabels: (state): string[] => state.show.dotLabels,
  getSelectedDotIds: (state): number[] => state.show.selectedDotIds,

  // Show -> Field
  getFrontHashOffsetY: (state): number => state.show.field.frontHashOffsetY,
  getBackHashOffsetY: (state): number => state.show.field.backHashOffsetY,
  getMiddleOfField: (state): number => state.show.field.middleOfField,

  // Show -> StuntSheet
  getSelectedStuntIndex: (state): number => state.show.selectedSS,
  getSelectedStuntSheet: (state): StuntSheet =>
    state.show.stuntSheets[state.show.selectedSS],
  getContinuity: (state) => (
    dotTypeIndex: number,
    continuityIndex: number
  ): BaseCont =>
    state.show.stuntSheets[state.show.selectedSS].dotTypes[dotTypeIndex][
      continuityIndex
    ],

  // Undo
  getCanUndo: (state): boolean => state.undoRedo.canUndo(),
  getUndoName: (state): string => state.undoRedo.undoString(),
  getCanRedo: (state): boolean => state.undoRedo.canRedo(),
  getRedoName: (state): string => state.undoRedo.redoString(),
};

export default getters;
