import { CalChartState } from '.';
import Show from '@/models/Show';
import getters from './getters';
import BaseTool from '@/tools/BaseTool';
import StuntSheetDot from '@/models/StuntSheetDot';
import { MutationTree } from 'vuex';

const mutations: MutationTree<CalChartState> = {
  // Show
  setShow(state, show: Show): void {
    state.show = show;
  },
  setShowTitle(state, title: string): void {
    state.show.title = title;
  },

  setCurrentSheet(state, which: number): void {
    if (which < 0 || which >= state.show.stuntSheets.length) {
      throw 'trying to set to a stunt sheet that does not exist';
    }
    state.show.currentSheet = which;
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
