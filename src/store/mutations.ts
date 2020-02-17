import { CalChartState } from '.';
import Show from '@/models/Show';
import getters from './getters';
import BaseTool from '@/tools/BaseTool';
import StuntSheetDot from '@/models/StuntSheetDot';
import { MutationTree } from 'vuex';
import StuntSheet from '@/models/StuntSheet';

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
    const getSelectedStuntSheet: Function = getters.getSelectedStuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.removeDot(dotIndex);
  },
  addDot(state, dot: StuntSheetDot): void {
    const getSelectedStuntSheet: Function = getters.getSelectedStuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.addDot(dot);
  },
  setStuntSheetTitle(state, title: string): void {
    const getSelectedStuntSheet: Function = getters.getSelectedStuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.title = title;
  },
  setStuntSheetBeats(state, beats: number): void {
    const getSelectedStuntSheet: Function = getters.getSelectedStuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.beats = beats;
  },

  // Show controls
  setSelectedSS(state, selectedSS: number): void {
    state.selectedSS = selectedSS;
  },
  setBeat(state, beat: number): void {
    state.beat = beat;
  },
  incrementBeat(state): void {
    const getSelectedStuntSheet: Function = getters.getSelectedStuntSheet;
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
      const getSelectedStuntSheet: Function = getters.getSelectedStuntSheet;
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
};

export default mutations;
