import { CalChartState } from ".";
import Show from "@/models/Show";
import getters from "./getters";
import BaseTool from "@/tools/BaseTool";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import { MutationTree } from "vuex";
import BaseCont from "@/models/continuity/BaseCont";
import ContInPlace from "@/models/continuity/ContInPlace";
import DotAppearance from "@/models/DotAppearance";

const mutations: MutationTree<CalChartState> = {
  // Show
  setShow(state, show: Show): void {
    state.show = show;
  },
  setShowTitle(state, title: string): void {
    state.show.title = title;
  },
  addStuntSheet(state): void {
    state.show.stuntSheets.push(
      new StuntSheet({
        title: `Stuntsheet ${state.show.stuntSheets.length + 1}`,
      })
    );
    state.selectedSS = state.show.stuntSheets.length - 1;
    state.beat = 1;
  },
  deleteStuntSheet(state): void {
    state.show.stuntSheets.splice(state.selectedSS, 1);
    state.selectedSS = Math.max(0, state.selectedSS - 1);
    state.beat = 1;
  },

  // Show -> Field
  setFrontHashOffsetY(state, offsetY: number): void {
    state.show.field.frontHashOffsetY = offsetY;
  },
  setBackHashOffsetY(state, offsetY: number): void {
    state.show.field.backHashOffsetY = offsetY;
  },
  setMiddleOfField(state, middle: number): void {
    state.show.field.middleOfField = middle;
  },

  // Show -> StuntSheet
  removeDot(state, dotId: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.removeDot(dotId);
  },
  addDot(state, dot: Partial<StuntSheetDot>): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.addDot(dot);
  },
  moveDot(
    state,
    { dotId, position }: { dotId: number; position: [number, number] }
  ): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.moveDot(dotId, position);
  },
  setStuntSheetTitle(state, title: string): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.title = title;
  },
  setStuntSheetBeats(state, beats: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.beats = beats;
  },
  addDotType(state): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes.push([new ContInPlace()]);
    currentSS.dotAppearances.push(new DotAppearance());
  },
  addContinuity(
    state,
    { dotTypeIndex, continuity }: { dotTypeIndex: number; continuity: BaseCont }
  ): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes[dotTypeIndex].push(continuity);
    state.show.generateFlows(state.selectedSS);
  },

  // Show -> StuntSheet -> BaseCont
  updateDotTypeContinuity(
    state,
    {
      dotTypeIndex,
      continuityIndex,
      continuity,
    }: { dotTypeIndex: number; continuityIndex: number; continuity: BaseCont }
  ): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes[dotTypeIndex][continuityIndex] = continuity;
    state.show.generateFlows(state.selectedSS);
  },
  deleteDotTypeContinuity(
    state,
    {
      dotTypeIndex,
      continuityIndex,
    }: { dotTypeIndex: number; continuityIndex: number }
  ): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes[dotTypeIndex].splice(continuityIndex, 1);
    state.show.generateFlows(state.selectedSS);
  },

  // Show controls
  setSelectedSS(state, selectedSS: number): void {
    state.selectedSS = selectedSS;
  },
  setBeat(state, beat: number): void {
    state.beat = beat;
  },
  incrementBeat(state): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS: StuntSheet = getSelectedStuntSheet(state);
    if (state.beat < currentSS.beats) {
      state.beat += 1;
    } else if (state.selectedSS + 1 < state.show.stuntSheets.length) {
      // Go to next stuntsheet's first beat
      state.selectedSS += 1;
      state.beat = 1;
    }
  },
  decrementBeat(state): void {
    if (state.beat > 1) {
      state.beat -= 1;
    } else if (state.selectedSS > 0) {
      // Go to previous stuntsheet's last beat
      state.selectedSS -= 1;
      const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
        state: CalChartState
      ) => StuntSheet;
      const currentSS: StuntSheet = getSelectedStuntSheet(state);
      state.beat = currentSS.beats;
    }
  },

  // View Settings
  setFourStepGrid(state, enabled: boolean): void {
    state.fourStepGrid = enabled;
  },
  setYardlines(state, enabled: boolean): void {
    state.yardlines = enabled;
  },
  setYardlineNumbers(state, enabled: boolean): void {
    state.yardlineNumbers = enabled;
  },
  setShowDotLabels(state, enabled: boolean): void {
    state.showDotLabels = enabled;
  },

  // Tools
  setGrapherSvgPanZoom(state, svgPanZoomInstance: SvgPanZoom.Instance): void {
    state.grapherSvgPanZoom = svgPanZoomInstance;
  },
  setInvertedCTMMatrix(state, matrix: DOMMatrix): void {
    state.invertedCTMMatrix = matrix;
  },
  setToolSelected(state, toolSelected: BaseTool): void {
    state.toolSelected = toolSelected;
    state.grapherToolDots = [];
  },
  setGrapherToolDots(state, grapherToolDots: StuntSheetDot[]): void {
    state.grapherToolDots = grapherToolDots;
  },

  // selection
  clearSelectedDotIds(state): void {
    state.selectedDotIds = [];
  },
  addSelectedDotIds(state, dotIds: number[]): void {
    dotIds.forEach((id) => {
      !state.selectedDotIds.includes(id) && state.selectedDotIds.push(id);
    });
  },
  toggleSelectedDotIds(state, dotIds: number[]): void {
    // first remove all the items passed in.
    dotIds.forEach((id) => {
      const index = state.selectedDotIds.indexOf(id);
      if (index > -1) {
        state.selectedDotIds.splice(index, 1);
      } else {
        state.selectedDotIds.push(id);
      }
    });
  },
  setSelectionLasso(state, lasso: [number, number][]): void {
    state.selectionLasso = lasso;
  },
};

export default mutations;
