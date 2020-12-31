import { CalChartState } from ".";
import InitialShowState from "@/models/InitialShowState";
import getters from "./getters";
import BaseTool from "@/tools/BaseTool";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import { MutationTree } from "vuex";
import BaseCont from "@/models/continuity/BaseCont";
import ContInPlace from "@/models/continuity/ContInPlace";

// Show mutations:
export const SET_SHOW = 'setShow';
export const SET_SHOW_TITLE = 'setShowTitle';
export const ADD_STUNT_SHEET = 'addStuntSheet';
export const DELETE_STUNT_SHEET = 'deleteStuntSheet';
// Field mutations:
export const SET_FRONT_HASH_OFFSET_Y = 'setFrontHashOffsetY';
export const SET_BACK_HASH_OFFSET_Y = 'setBackHashOffsetY';
export const SET_MIDDLE_OF_FIELD = 'setMiddleOfField';
// Stuntsheet mutations:
export const ADD_DOTS = 'addDots';
export const REMOVE_DOTS = 'removeDots';
export const MOVE_DOTS = 'moveDots';
export const SET_STUNT_SHEET_TITLE = 'setStuntSheetTitle';
export const SET_STUNT_SHEET_BEATS = 'setStuntSheetBeats';
export const ADD_DOT_TYPE = 'addDotType';
export const ADD_CONTINUITY = 'addContinuity';
// Continuity mutations:
export const UPDATE_DOT_TYPE_CONTINUITY = 'updateDotTypeContinuity';
export const DELETE_DOT_TYPE_CONTINUITY = 'deleteDotTypeContinuity';

// View mutations:
export const SET_SELECTED_SS = 'setSelectedSS';
export const SET_BEAT = 'setBeat';
export const INCREMENT_BEAT = 'incrementBeat';
export const DECREMENT_BEAT = 'decrementBeat';
// Field view mutations:
export const SET_FOUR_STEP_GRID = 'setFourStepGrid';
export const SET_YARDLINES = 'setYardlines';
export const SET_YARDLINE_NUMBERS = 'setYardlineNumbers';
export const SET_SHOW_DOT_LABELS = 'setShowDotLabels';
// Tools
export const SET_GRAPHER_SVG_PAN_ZOOM = 'setGrapherSvgPanZoom';
export const SET_INVERTED_CTM_MATRIX = 'setInvertedCTMMatrix';
export const SET_TOOL_SELECTED = 'setToolSelected';
export const SET_GRAPHER_TOOL_DOTS = 'setGrapherToolDots'
// selection
export const CLEAR_SELECTED_DOTS = 'clearSelectedDots';
export const ADD_SELECTED_DOTS = 'addSelectedDots';
export const TOGGLE_SELECTED_DOTS = 'toggleSelectedDots';
export const SET_SELECTION_LASSO = 'setSelectionLasso';


export const UNDO = 'undo';
export const REDO = 'redo';
export const INITIAL_SHOW_STATE = 'resetShowState';

export const UNDOABLE_ACTIONS = [ 
  SET_SHOW_TITLE,
  ADD_STUNT_SHEET,
  DELETE_STUNT_SHEET,
  SET_FRONT_HASH_OFFSET_Y,
  SET_BACK_HASH_OFFSET_Y,
  SET_MIDDLE_OF_FIELD,
  ADD_DOTS,
  REMOVE_DOTS,
  MOVE_DOTS,
  SET_STUNT_SHEET_TITLE,
  SET_STUNT_SHEET_BEATS,
  ADD_DOT_TYPE,
  ADD_CONTINUITY,
  UPDATE_DOT_TYPE_CONTINUITY,
  DELETE_DOT_TYPE_CONTINUITY
];

export const mutations: MutationTree<CalChartState> = {
  [SET_SHOW] (state, initialShowState: InitialShowState): void {
    state.initialShowState = initialShowState;
    state.show = state.initialShowState.getInitialState();
  },
  [SET_SHOW_TITLE] (state, title: string): void {
    state.show.title = title;
  },
  [ADD_STUNT_SHEET] (state, stuntSheet: StuntSheet): void {
    state.show.stuntSheets.push(stuntSheet);
    state.selectedSS = state.show.stuntSheets.length - 1;
    state.beat = 1;
  },
  [DELETE_STUNT_SHEET](state): void {
    state.show.stuntSheets.splice(state.selectedSS, 1);
    state.selectedSS = Math.max(0, state.selectedSS - 1);
    state.beat = 1;
  },

  // Show -> Field
  [SET_FRONT_HASH_OFFSET_Y](state, offsetY: number): void {
    state.show.field.frontHashOffsetY = offsetY;
  },
  [SET_BACK_HASH_OFFSET_Y](state, offsetY: number): void {
    state.show.field.backHashOffsetY = offsetY;
  },
  [SET_MIDDLE_OF_FIELD](state, middle: number): void {
    state.show.field.middleOfField = middle;
  },

  // Show -> StuntSheet
  [REMOVE_DOTS](state, dotIndex: number[]): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.removeDots(dotIndex);
  },
  [ADD_DOTS] (state, dot: { x:number, y:number }[]): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.addDots(dot.map( d => new StuntSheetDot(d)));
  },
  [MOVE_DOTS](
    state,
    newPositions: [number, [number, number]][]
  ): void {
    console.log("move a dot here")
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.moveDots(newPositions);
  },
  [SET_STUNT_SHEET_TITLE](state, title: string): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.title = title;
  },
  [SET_STUNT_SHEET_BEATS](state, beats: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.beats = beats;
  },
  [ADD_DOT_TYPE](state): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes.push([new ContInPlace()]);
  },
  [ADD_CONTINUITY](
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
  [UPDATE_DOT_TYPE_CONTINUITY](
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
  [DELETE_DOT_TYPE_CONTINUITY](
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
  [SET_SELECTED_SS](state, selectedSS: number): void {
    state.selectedSS = selectedSS;
  },
  [SET_BEAT](state, beat: number): void {
    state.beat = beat;
  },
  [INCREMENT_BEAT](state): void {
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
  [DECREMENT_BEAT](state): void {
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
  [SET_FOUR_STEP_GRID](state, enabled: boolean): void {
    state.fourStepGrid = enabled;
  },
  [SET_YARDLINES](state, enabled: boolean): void {
    state.yardlines = enabled;
  },
  [SET_YARDLINE_NUMBERS](state, enabled: boolean): void {
    state.yardlineNumbers = enabled;
  },
  [SET_SHOW_DOT_LABELS](state, enabled: boolean): void {
    state.showDotLabels = enabled;
  },

  // Tools
  [SET_GRAPHER_SVG_PAN_ZOOM](state, svgPanZoomInstance: SvgPanZoom.Instance): void {
    state.grapherSvgPanZoom = svgPanZoomInstance;
  },
  [SET_INVERTED_CTM_MATRIX](state, matrix: DOMMatrix): void {
    state.invertedCTMMatrix = matrix;
  },
  [SET_TOOL_SELECTED](state, toolSelected: BaseTool): void {
    state.toolSelected = toolSelected;
    state.grapherToolDots = [];
  },
  [SET_GRAPHER_TOOL_DOTS](state, grapherToolDots: StuntSheetDot[]): void {
    state.grapherToolDots = grapherToolDots;
  },

  // selection
  [CLEAR_SELECTED_DOTS](state): void {
    state.selectedDots = [];
  },
  [ADD_SELECTED_DOTS](state, dots: number[]): void {
    dots.forEach((dot) => {
      state.selectedDots.indexOf(dot) < 0 && state.selectedDots.push(dot);
    });
  },
  [TOGGLE_SELECTED_DOTS](state, dots: number[]): void {
    // first remove all the items passed in.
    dots.forEach((v) => {
      const index = state.selectedDots.indexOf(v);
      if (index > -1) {
        state.selectedDots.splice(index, 1);
      } else {
        state.selectedDots.push(v);
      }
    });
  },
  [SET_SELECTION_LASSO](state, lasso: [number, number][]): void {
    state.selectionLasso = lasso;
  },

  // Undo system
  [UNDO] (state): void {
    // intentionally empty as the Undo system is "sniffing" for this command.
  },
  [REDO] (state): void {
    // intentionally empty as the Undo system is "sniffing" for this command.
  },
  [INITIAL_SHOW_STATE] (state): void {
    state.show = state.initialShowState.getInitialState();
  },
  
};

