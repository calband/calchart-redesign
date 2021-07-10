import Vue from "vue";
import Vuex, { Store } from "vuex";
import { mutations } from "./mutations";
import getters from "./getters";
import Show from "@/models/Show";
import Serializable from "@/models/util/Serializable";
import BaseTool from "@/tools/BaseTool";
import StuntSheetDot from "@/models/StuntSheetDot";
import { UndoRedo } from "@/models/UndoRedo";

Vue.use(Vuex);

/**
 * Defines the global state for the application.
 *
 * @property show              - The currently selected show data
 * @property undoRedo          - The undoRedo state
 * @property fourStepGrid      - View setting to toggle the grapher grid
 * @property grapherSvgPanZoom - Initialized upon mounting Grapher
 * @property invertedCTMMatrix - Used to calculate clientX/Y to SVG X/Y
 * @property toolSelected      - See BaseTool
 * @property grapherToolDots   - Helper dots to help visualize tools
 */
export class CalChartState extends Serializable<CalChartState> {
  show: Show = new Show();

  undoRedo: UndoRedo = new UndoRedo();

  fourStepGrid = true;

  yardlines = true;

  yardlineNumbers = true;

  showDotLabels = true;

  gridSize = 2;

  grapherSvgPanZoom?: SvgPanZoom.Instance;

  invertedCTMMatrix?: DOMMatrix;

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
): Store<CalChartState> => {
  const show = new CalChartState(json);
  return new Vuex.Store({
    state: show,
    mutations,
    getters,
    plugins: [show.undoRedo.createPlugin()],
  });
};

export const GlobalStore = generateStore();
