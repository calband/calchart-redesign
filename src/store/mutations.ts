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
import ContGateTurn from "@/models/continuity/ContGateTurn";
import Show from "@/models/Show";

export enum Mutations {
  // Show mutations:
  SET_NEW_SHOW = "Set new Show",
  SET_SHOW = "Set show state",
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
  UPDATE_DOT_TYPE_ANGLE = "Update Marcher Angle",

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
  Mutations.UPDATE_DOT_TYPE_ANGLE,
];

export const mutations: MutationTree<CalChartState> = {
  [Mutations.SET_SHOW](state, initialShowState: InitialShowState): void {
    state.show = initialShowState.getInitialState();
    state.show.calculateIssuesDeep();
    state.undoRedo.reinitializeUndoRedo(state.show);
  },
  [Mutations.SET_SHOW](state, show: Show): void {
    state.show = show;
    state.show.beat = 0;
  },
  [Mutations.SET_SHOW_TITLE](state, title: string): void {
    state.show.title = title;
    state.show.calculateIssuesShallow();
  },
  [Mutations.ADD_STUNT_SHEET](state, prevSS: number): void {
    state.show.stuntSheets.push(
      new StuntSheet({
        title: `Stuntsheet ${state.show.stuntSheets.length + 1}`,
        stuntSheetDots: state.show.stuntSheets[prevSS].stuntSheetDots,
        dotTypes: state.show.stuntSheets[prevSS].dotTypes,
        dotAppearances: state.show.stuntSheets[prevSS].dotAppearances,
      })
    );
    state.show.selectedSS = state.show.stuntSheets.length - 1;
    state.show.beat = 0;
    state.show.calculateIssuesShallow();
  },
  [Mutations.DELETE_STUNT_SHEET](state): void {
    state.show.stuntSheets.splice(state.show.selectedSS, 1);
    state.show.selectedSS = Math.max(0, state.show.selectedSS - 1);
    state.show.beat = 0;
    state.show.calculateIssuesShallow();
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
    state.show.calculateIssuesShallow();
    currentSS.calculateIssuesDeep(state.show.selectedSS);
  },
  [Mutations.ADD_DOTS](state, jsons: Partial<StuntSheetDot>[]): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.addDots(jsons.map((json) => new StuntSheetDot(json)));
    state.show.generateFlows(state.show.selectedSS);
    state.show.calculateIssuesShallow();
    currentSS.calculateIssuesDeep(state.show.selectedSS);
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
    state.show.generateFlows(state.show.selectedSS);
    currentSS.calculateIssuesDeep(state.show.selectedSS);
  },
  [Mutations.UPDATE_SELECTED_DOTS_DOT_TYPE](state, dotTypeIndex: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    const { selectedDotIds } = state.show;
    if (selectedDotIds.length) {
      selectedDotIds.forEach((dotId) => {
        const dot = currentSS.stuntSheetDots.find((dot) => dot.id === dotId);
        if (dot) {
          dot.dotTypeIndex = dotTypeIndex;
          dot.calculateIssuesShallow(state.show.selectedSS, dotId);
        }
      });
      state.show.generateFlows(state.show.selectedSS);
    }
    currentSS.calculateIssuesDeep(state.show.selectedSS);
  },
  [Mutations.SET_STUNT_SHEET_TITLE](state, title: string): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.title = title;
    currentSS.calculateIssuesShallow(state.show.selectedSS);
  },
  [Mutations.SET_STUNT_SHEET_BEATS](state, beats: number): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.beats = beats;
    currentSS.calculateIssuesShallow(state.show.selectedSS);
  },
  [Mutations.ADD_DOT_TYPE](state): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS = getSelectedStuntSheet(state);
    currentSS.dotTypes.push([new ContInPlace()]);
    currentSS.dotAppearances.push(new DotAppearance());
    currentSS.calculateIssuesDeep(state.show.selectedSS);
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
    state.show.generateFlows(state.show.selectedSS);
    currentSS.calculateIssuesDeep(state.show.selectedSS);
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
  [Mutations.UPDATE_DOT_TYPE_ANGLE](
    state,
    {
      dotTypeIndex,
      continuityIndex,
      angle,
    }: { dotTypeIndex: number; continuityIndex: number; angle: number }
  ): void {
    const getContinuity = getters.getContinuity as (
      state: CalChartState
    ) => (dotTypeIndex: number, continuityIndex: number) => ContGateTurn;
    const continuity: ContGateTurn = getContinuity(state)(
      dotTypeIndex,
      continuityIndex
    );
    continuity.angle = angle;
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
    state.show.generateFlows(state.show.selectedSS);
    currentSS.calculateIssuesDeep(state.show.selectedSS);
  },

  // Show controls
  [Mutations.SET_SELECTED_SS](state, selectedSS: number): void {
    state.show.selectedSS = selectedSS;
  },
  [Mutations.SET_BEAT](state, beat: number): void {
    state.show.beat = beat;
  },
  [Mutations.INCREMENT_BEAT](state): void {
    const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
      state: CalChartState
    ) => StuntSheet;
    const currentSS: StuntSheet = getSelectedStuntSheet(state);

    if (state.show.beat + 1 >= currentSS.beats) {
      if (state.show.selectedSS + 1 < state.show.stuntSheets.length) {
        // Go to next stuntsheet's Hup! beat
        state.show.selectedSS += 1;
        state.show.beat = 0;
      } else {
        // If the last stuntsheet, go to the last beat
        state.show.beat = currentSS.beats;
      }
    } else {
      state.show.beat += 1;
    }
  },
  [Mutations.DECREMENT_BEAT](state): void {
    if (state.show.beat - 1 < 0) {
      if (state.show.selectedSS > 0) {
        // Go to previous stuntsheet's 2nd to last beat
        state.show.selectedSS -= 1;
        const getSelectedStuntSheet = getters.getSelectedStuntSheet as (
          state: CalChartState
        ) => StuntSheet;
        const currentSS: StuntSheet = getSelectedStuntSheet(state);
        state.show.beat = currentSS.beats - 1;
      } else {
        // If the first stuntsheet, go to Hup! beat
        state.show.beat = 0;
      }
    } else {
      state.show.beat -= 1;
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
    state.show.selectedDotIds = [];
  },
  [Mutations.ADD_SELECTED_DOTS](state, dotIds: number[]): void {
    dotIds.forEach((id) => {
      !state.show.selectedDotIds.includes(id) &&
        state.show.selectedDotIds.push(id);
    });
  },
  [Mutations.TOGGLE_SELECTED_DOTS](state, dotIds: number[]): void {
    // first remove all the items passed in.
    dotIds.forEach((id) => {
      const index = state.show.selectedDotIds.indexOf(id);
      if (index > -1) {
        state.show.selectedDotIds.splice(index, 1);
      } else {
        state.show.selectedDotIds.push(id);
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
  state.show.generateFlows(state.show.selectedSS);
  currentSS.calculateIssuesDeep(state.show.selectedSS);
}
