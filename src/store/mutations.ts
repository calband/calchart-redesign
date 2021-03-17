import { CalChartState } from ".";
import InitialShowState from "@/models/InitialShowState";
import getters from "./getters";
import BaseTool from "@/tools/BaseTool";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import { MutationTree } from "vuex";
import { BaseCont, CONT_IDS, ContFactory } from "@/models/continuity/BaseCont";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContETFDynamic, {
  ETF_DYNAMIC_TYPES,
} from "@/models/continuity/ContETFDynamic";
import DotAppearance from "@/models/DotAppearance";
import { MARCH_TYPES } from "@/models/util/constants";
import ContETFStatic from "@/models/continuity/ContETFStatic";

export enum Mutations {
  // Show mutations:
  SET_SHOW = "Set new Show",
  SET_SHOW_TITLE = "Set Show title",
  ADD_STUNT_SHEET = "Add Stunt Sheet",
  DELETE_STUNT_SHEET = "Delete Stunt Sheet",
  // Field mutations:
  SET_FRONT_HASH_OFFSET_Y = "Set front hash offset",
  SET_BACK_HASH_OFFSET_Y = "Set back has offset",
  SET_MIDDLE_OF_FIELD = "Set middle of field",
  // Stuntsheet mutations:
  ADD_DOTS = "Add Marcher",
  REMOVE_DOTS = "Remove Marcher",
  MOVE_DOTS = "Move Marcher",
  UPDATE_SELECTED_DOTS_DOT_TYPE = "Update Selected Dots' Dot Type",
  SET_STUNT_SHEET_TITLE = "Set Stunt Sheet title",
  SET_STUNT_SHEET_BEATS = "Set Stund Sheet beats",
  ADD_DOT_TYPE = "Add Marcher type",
  ADD_CONTINUITY = "Add Continuity",
  // Continuity mutations:
  UPDATE_DOT_TYPE_MARCH_STYLE = "Update Marcher Step Style",
  UPDATE_DOT_TYPE_DURATION = "Update Marcher Duration",
  UPDATE_DOT_TYPE_ETF_TYPE = "Update Marcher Eight To Five Flow",
  UPDATE_DOT_TYPE_ETF_DIRECTION = "Update Marcher Flow Direction",
  UPDATE_DOT_TYPE_IN_PLACE_DIRECTION = "Update Marcher Standing Direction",
  DELETE_DOT_TYPE_CONTINUITY = "Remove Marcher Continuity",

  // View mutations:
  SET_SELECTED_SS = "setSelectedSS",
  SET_BEAT = "setBeat",
  INCREMENT_BEAT = "incrementBeat",
  DECREMENT_BEAT = "decrementBeat",
  // Field view mutations:
  SET_FOUR_STEP_GRID = "setFourStepGrid",
  SET_YARDLINES = "setYardlines",
  SET_YARDLINE_NUMBERS = "setYardlineNumbers",
  SET_SHOW_DOT_LABELS = "setShowDotLabels",
  // Tools
  SET_GRAPHER_SVG_PAN_ZOOM = "setGrapherSvgPanZoom",
  SET_INVERTED_CTM_MATRIX = "setInvertedCTMMatrix",
  SET_TOOL_SELECTED = "setToolSelected",
  SET_GRAPHER_TOOL_DOTS = "setGrapherToolDots",
  // selection
  CLEAR_SELECTED_DOTS = "clearSelectedDots",
  ADD_SELECTED_DOTS = "addSelectedDots",
  TOGGLE_SELECTED_DOTS = "toggleSelectedDots",
  SET_SELECTION_LASSO = "setSelectionLasso",

  UNDO = "undo",
  REDO = "redo",
  INITIAL_SHOW_STATE = "resetShowState",
}

export const UNDOABLE_ACTIONS = [
  Mutations.SET_SHOW_TITLE,
  Mutations.ADD_STUNT_SHEET,
  Mutations.DELETE_STUNT_SHEET,
  Mutations.SET_FRONT_HASH_OFFSET_Y,
  Mutations.SET_BACK_HASH_OFFSET_Y,
  Mutations.SET_MIDDLE_OF_FIELD,
  Mutations.ADD_DOTS,
  Mutations.REMOVE_DOTS,
  Mutations.MOVE_DOTS,
  Mutations.UPDATE_SELECTED_DOTS_DOT_TYPE,
  Mutations.SET_STUNT_SHEET_TITLE,
  Mutations.SET_STUNT_SHEET_BEATS,
  Mutations.ADD_DOT_TYPE,
  Mutations.ADD_CONTINUITY,
  Mutations.UPDATE_DOT_TYPE_MARCH_STYLE,
  Mutations.UPDATE_DOT_TYPE_DURATION,
  Mutations.UPDATE_DOT_TYPE_ETF_TYPE,
  Mutations.UPDATE_DOT_TYPE_ETF_DIRECTION,
  Mutations.UPDATE_DOT_TYPE_IN_PLACE_DIRECTION,
  Mutations.DELETE_DOT_TYPE_CONTINUITY,
];

export const mutations: MutationTree<CalChartState> = {
  [Mutations.SET_SHOW](state, initialShowState: InitialShowState): void {
    state.initialShowState = initialShowState;
    state.show = state.initialShowState.getInitialState();
    state.show.calculateWarningsDeep();
  },
  [Mutations.SET_SHOW_TITLE](state, title: string): void {
    state.show.title = title;
    state.show.calculateWarningsShallow();
  },
  [Mutations.ADD_STUNT_SHEET](state): void {
    state.show.stuntSheets.push(
      new StuntSheet({
        title: `Stuntsheet ${state.show.stuntSheets.length + 1}`,
      })
    );
    state.selectedSS = state.show.stuntSheets.length - 1;
    state.beat = 0;
    state.show.calculateWarningsShallow();
  },
  [Mutations.DELETE_STUNT_SHEET](state): void {
    state.show.stuntSheets.splice(state.selectedSS, 1);
    state.selectedSS = Math.max(0, state.selectedSS - 1);
    state.beat = 0;
    state.show.calculateWarningsShallow();
  },

  // Show -> Field
  [Mutations.SET_FRONT_HASH_OFFSET_Y](state, offsetY: number): void {
    state.show.field.frontHashOffsetY = offsetY;
  },
  [Mutations.SET_BACK_HASH_OFFSET_Y](state, offsetY: number): void {
    state.show.field.backHashOffsetY = offsetY;
  },
  [Mutations.SET_MIDDLE_OF_FIELD](state, middle: number): void {
    state.show.field.middleOfField = middle;
  },

  // Show -> StuntSheet
  [Mutations.REMOVE_DOTS](state, dotIndex: number[]): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.removeDots(dotIndex);
    state.show.calculateWarningsShallow();
    currentSS.calculateWarningsDeep(state.selectedSS);
  },
  [Mutations.ADD_DOTS](state, jsons: Partial<StuntSheetDot>[]): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.addDots(jsons.map((json) => new StuntSheetDot(json)));
    state.show.generateFlows(state.selectedSS);
    state.show.calculateWarningsShallow();
    currentSS.calculateWarningsDeep(state.selectedSS);
  },
  [Mutations.MOVE_DOTS](
    state,
    newPositions: [number, [number, number]][]
  ): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.moveDots(newPositions);
    state.show.generateFlows(state.selectedSS);
    currentSS.calculateWarningsDeep(state.selectedSS);
  },
  [Mutations.UPDATE_SELECTED_DOTS_DOT_TYPE](state, dotTypeIndex: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    const { selectedDotIds } = state;
    if (selectedDotIds.length) {
      selectedDotIds.forEach((dotId) => {
        const dot = currentSS.stuntSheetDots.find((dot) => dot.id === dotId);
        if (dot) {
          dot.dotTypeIndex = dotTypeIndex;
          dot.calculateWarningsShallow(state.selectedSS, dotId);
        }
      });
      state.show.generateFlows(state.selectedSS);
    }
    currentSS.calculateWarningsDeep(state.selectedSS);
  },
  [Mutations.SET_STUNT_SHEET_TITLE](state, title: string): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.title = title;
    currentSS.calculateWarningsShallow(state.selectedSS);
  },
  [Mutations.SET_STUNT_SHEET_BEATS](state, beats: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.beats = beats;
    currentSS.calculateWarningsShallow(state.selectedSS);
  },
  [Mutations.ADD_DOT_TYPE](state): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes.push([new ContInPlace()]);
    currentSS.dotAppearances.push(new DotAppearance());
    currentSS.calculateWarningsDeep(state.selectedSS);
  },
  [Mutations.ADD_CONTINUITY](
    state,
    { dotTypeIndex, contID }: { dotTypeIndex: number; contID: CONT_IDS }
  ): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes[dotTypeIndex].push(ContFactory(contID));
    state.show.generateFlows(state.selectedSS);
    currentSS.calculateWarningsDeep(state.selectedSS);
  },

  // Show -> StuntSheet -> BaseCont
  [Mutations.UPDATE_DOT_TYPE_MARCH_STYLE](
    state,
    {
      dotTypeIndex,
      continuityIndex,
      marchType,
    }: { dotTypeIndex: number; continuityIndex: number; marchType: MARCH_TYPES }
  ): void {
    const getContinuity = getters.getContinuity as (
      state: CalChartState
    ) => (dotTypeIndex: number, continuityIndex: number) => BaseCont;
    const continuity: BaseCont = getContinuity(state)(
      dotTypeIndex,
      continuityIndex
    );
    continuity.marchType = marchType;
    updateContinuity(state, dotTypeIndex, continuityIndex, continuity);
  },
  [Mutations.UPDATE_DOT_TYPE_DURATION](
    state,
    {
      dotTypeIndex,
      continuityIndex,
      duration,
    }: { dotTypeIndex: number; continuityIndex: number; duration: number }
  ): void {
    const getContinuity = getters.getContinuity as (
      state: CalChartState
    ) => (dotTypeIndex: number, continuityIndex: number) => BaseCont;
    const continuity: BaseCont = getContinuity(state)(
      dotTypeIndex,
      continuityIndex
    );
    continuity.duration = duration;
    updateContinuity(state, dotTypeIndex, continuityIndex, continuity);
  },
  [Mutations.UPDATE_DOT_TYPE_ETF_TYPE](
    state,
    {
      dotTypeIndex,
      continuityIndex,
      etfType,
    }: {
      dotTypeIndex: number;
      continuityIndex: number;
      etfType: ETF_DYNAMIC_TYPES;
    }
  ): void {
    const getContinuity = getters.getContinuity as (
      state: CalChartState
    ) => (dotTypeIndex: number, continuityIndex: number) => ContETFDynamic;
    const continuity: ContETFDynamic = getContinuity(state)(
      dotTypeIndex,
      continuityIndex
    );
    continuity.eightToFiveType = etfType;
    updateContinuity(state, dotTypeIndex, continuityIndex, continuity);
  },
  [Mutations.UPDATE_DOT_TYPE_ETF_DIRECTION](
    state,
    {
      dotTypeIndex,
      continuityIndex,
      direction,
    }: { dotTypeIndex: number; continuityIndex: number; direction: number }
  ): void {
    const getContinuity = getters.getContinuity as (
      state: CalChartState
    ) => (dotTypeIndex: number, continuityIndex: number) => ContETFStatic;
    const continuity: ContETFStatic = getContinuity(state)(
      dotTypeIndex,
      continuityIndex
    );
    continuity.marchingDirection = direction;
    continuity.facingDirection = direction;
    updateContinuity(state, dotTypeIndex, continuityIndex, continuity);
  },
  [Mutations.UPDATE_DOT_TYPE_IN_PLACE_DIRECTION](
    state,
    {
      dotTypeIndex,
      continuityIndex,
      direction,
    }: { dotTypeIndex: number; continuityIndex: number; direction: number }
  ): void {
    const getContinuity = getters.getContinuity as (
      state: CalChartState
    ) => (dotTypeIndex: number, continuityIndex: number) => ContInPlace;
    const continuity: ContInPlace = getContinuity(state)(
      dotTypeIndex,
      continuityIndex
    );
    continuity.direction = direction;
    updateContinuity(state, dotTypeIndex, continuityIndex, continuity);
  },
  [Mutations.DELETE_DOT_TYPE_CONTINUITY](
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
    currentSS.calculateWarningsDeep(state.selectedSS);
  },

  // Show controls
  [Mutations.SET_SELECTED_SS](state, selectedSS: number): void {
    state.selectedSS = selectedSS;
  },
  [Mutations.SET_BEAT](state, beat: number): void {
    state.beat = beat;
  },
  [Mutations.INCREMENT_BEAT](state): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS: StuntSheet = getSelectedStuntSheet(state);

    if (state.beat + 1 >= currentSS.beats) {
      if (state.selectedSS + 1 < state.show.stuntSheets.length) {
        // Go to next stuntsheet's Hup! beat
        state.selectedSS += 1;
        state.beat = 0;
      } else {
        // If the last stuntsheet, go to the last beat
        state.beat = currentSS.beats;
      }
    } else {
      state.beat += 1;
    }
  },
  [Mutations.DECREMENT_BEAT](state): void {
    if (state.beat - 1 < 0) {
      if (state.selectedSS > 0) {
        // Go to previous stuntsheet's 2nd to last beat
        state.selectedSS -= 1;
        const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
          state: CalChartState
        ) => StuntSheet;
        const currentSS: StuntSheet = getSelectedStuntSheet(state);
        state.beat = currentSS.beats - 1;
      } else {
        // If the first stuntsheet, go to Hup! beat
        state.beat = 0;
      }
    } else {
      state.beat -= 1;
    }
  },

  // View Settings
  [Mutations.SET_FOUR_STEP_GRID](state, enabled: boolean): void {
    state.fourStepGrid = enabled;
  },
  [Mutations.SET_YARDLINES](state, enabled: boolean): void {
    state.yardlines = enabled;
  },
  [Mutations.SET_YARDLINE_NUMBERS](state, enabled: boolean): void {
    state.yardlineNumbers = enabled;
  },
  [Mutations.SET_SHOW_DOT_LABELS](state, enabled: boolean): void {
    state.showDotLabels = enabled;
  },

  // Tools
  [Mutations.SET_GRAPHER_SVG_PAN_ZOOM](
    state,
    svgPanZoomInstance: SvgPanZoom.Instance
  ): void {
    state.grapherSvgPanZoom = svgPanZoomInstance;
  },
  [Mutations.SET_INVERTED_CTM_MATRIX](state, matrix: DOMMatrix): void {
    state.invertedCTMMatrix = matrix;
  },
  [Mutations.SET_TOOL_SELECTED](state, toolSelected: BaseTool): void {
    state.toolSelected = toolSelected;
    state.grapherToolDots = [];
  },
  [Mutations.SET_GRAPHER_TOOL_DOTS](
    state,
    grapherToolDots: StuntSheetDot[]
  ): void {
    state.grapherToolDots = grapherToolDots;
  },

  // selection
  [Mutations.CLEAR_SELECTED_DOTS](state): void {
    state.selectedDotIds = [];
  },
  [Mutations.ADD_SELECTED_DOTS](state, dotIds: number[]): void {
    dotIds.forEach((id) => {
      !state.selectedDotIds.includes(id) && state.selectedDotIds.push(id);
    });
  },
  [Mutations.TOGGLE_SELECTED_DOTS](state, dotIds: number[]): void {
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
  [Mutations.SET_SELECTION_LASSO](state, lasso: [number, number][]): void {
    state.selectionLasso = lasso;
  },

  // Undo system
  [Mutations.UNDO](): void {
    // intentionally empty as the Undo system is "sniffing" for this command.
  },
  [Mutations.REDO](): void {
    // intentionally empty as the Undo system is "sniffing" for this command.
  },
  [Mutations.INITIAL_SHOW_STATE](state): void {
    state.show = state.initialShowState.getInitialState();
  },
};

function updateContinuity(
  state: CalChartState,
  dotTypeIndex: number,
  continuityIndex: number,
  continuity: BaseCont
) {
  const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
    state: CalChartState
  ) => StuntSheet;
  const currentSS = getSelectedStuntSheet(state);
  currentSS.dotTypes[dotTypeIndex][continuityIndex] = continuity;
  state.show.generateFlows(state.selectedSS);
  currentSS.calculateWarningsDeep(state.selectedSS);
}
