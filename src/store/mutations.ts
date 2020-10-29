import { CalChartState } from ".";
import Show from "@/models/Show";
import getters from "./getters";
import BaseTool from "@/tools/BaseTool";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import { MutationTree } from "vuex";
import BaseCont from "@/models/continuity/BaseCont";
import ContInPlace from "@/models/continuity/ContInPlace";

const mutations: MutationTree<CalChartState> = {
  // Show
  setShow(state, show: Show): void {
    state.show = show;
  },
  setShowTitle(state, title: string): void {
    state.show.title = title;
  },
  addStuntSheet(state, stuntSheet: StuntSheet): void {
    state.show.stuntSheets.push(stuntSheet);
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
  removeDot(state, dotIndex: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.removeDot(dotIndex);
  },
  addDot(state, dot: StuntSheetDot): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.addDot(dot);
  },
  syncDotLabelIndices(
    state,
    payload: { currentSSDotIndex: number; nextSSDotIndex: number }
  ): void {
    // TODO: Design a better way to connect dots between stuntsheets

    // Get the current and next stuntsheets
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS: StuntSheet = getSelectedStuntSheet(state);
    const getNextStuntSheet = getters.getNextStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const nextSS = getNextStuntSheet(state);

    // Set the current dot's label index if not already set
    const currentDot = currentSS.stuntSheetDots[payload.currentSSDotIndex];
    if (currentDot.dotLabelIndex === null) {
      let i: number;
      for (i = 0; i < currentSS.stuntSheetDots.length; i++) {
        const dotWithDotLabelIndex = currentSS.stuntSheetDots.findIndex(
          (dot) => dot.dotLabelIndex === i
        );
        if (dotWithDotLabelIndex === -1) {
          break;
        }
      }
      currentDot.dotLabelIndex = i;
    } else {
      // TODO: Can we make this not affect the next ss's dot's pairing with the next next ss?
      const pairedDot = nextSS.stuntSheetDots.find(
        (dot) => dot.dotLabelIndex === currentDot.dotLabelIndex
      );
      pairedDot && (pairedDot.dotLabelIndex = null);
    }

    // Set the next dot's label index to the current dot's
    const nextDot = nextSS.stuntSheetDots[payload.nextSSDotIndex];
    if (nextDot.dotLabelIndex === null) {
      nextDot.dotLabelIndex = currentDot.dotLabelIndex;
    } else {
      // TODO: If the next stuntsheet's dotLabelIndex is not null, then update
      // the paired dot in the next next stuntsheet, and so on. If there's a
      // dot on the current stuntsheet that's paired to this dot, then unset
      // that dot's dot label index.
      nextDot.dotLabelIndex = currentDot.dotLabelIndex;
    }

    state.show.generateFlows(state.selectedSS);

    // Reset tool
    state.toolSelected && (state.toolSelected.currentSSDotIndex = null);
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
  setIsSetNextPointMode(state, isSetNextPointMode: boolean): void {
    state.isSetNextPointMode = isSetNextPointMode;
    state.toolSelected = null;
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
  updateToolSelectedNextPoint(state, dotIndex: number): void {
    state.toolSelected && (state.toolSelected.currentSSDotIndex = dotIndex);
  },
};

export default mutations;
