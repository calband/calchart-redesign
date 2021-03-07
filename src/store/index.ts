import Vue from "vue";
import Vuex, { Store } from "vuex";
import { mutations } from "./mutations";
import getters from "./getters";
import Show from "@/models/Show";
import Serializable from "@/models/util/Serializable";
import BaseTool from "@/tools/BaseTool";
import StuntSheetDot from "@/models/StuntSheetDot";
import InitialShowState from "@/models/InitialShowState";
import Warning, { WarningType } from "@/models/util/warning";

Vue.use(Vuex);

/**
 * Defines the global state for the application
 *
 * @property show              - The currently selected show data
 * @property initialShowState  - Beginning spot for show
 * @property selectedSS        - Index of stuntsheet currently in view
 * @property beat              - The point in time the show is in
 * @property fourStepGrid      - View setting to toggle the grapher grid
 * @property grapherSvgPanZoom - Initialized upon mounting Grapher
 * @property invertedCTMMatrix - Used to calculate clientX/Y to SVG X/Y
 * @property toolSelected      - See BaseTool
 * @property grapherToolDots   - Helper dots to help visualize tools
 */
export class CalChartState extends Serializable<CalChartState> {
  show: Show = new Show();

  initialShowState: InitialShowState = new InitialShowState();

  selectedSS = 0;

  beat = 0;

  fourStepGrid = true;

  yardlines = true;

  yardlineNumbers = true;

  showDotLabels = true;

  grapherSvgPanZoom?: SvgPanZoom.Instance;

  invertedCTMMatrix?: DOMMatrix;

  selectedDotIds: number[] = [];

  toolSelected?: BaseTool;

  grapherToolDots: StuntSheetDot[] = [];

  showSelectionLasso = true;

  selectionLasso: [number, number][] = [];

  constructor(json: Partial<CalChartState> = {}) {
    super();
    this.fromJson(json);
  }
}

export const generateStore = (
  json: Partial<CalChartState> = {}
): Store<CalChartState> =>
  new Vuex.Store({
    state: new CalChartState(json),
    mutations,
    getters,
  });

export const GlobalStore = generateStore();
