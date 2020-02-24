import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import mutations from './mutations';
import getters from './getters';
import Show from '@/models/Show';
import Serializable from '@/models/util/Serializable';
import BaseTool from '@/tools/BaseTool';
import StuntSheetDot from '@/models/StuntSheetDot';

Vue.use(Vuex);

/**
 * Defines the global state for the application
 *
 * @property show              - The currently selected show data
 * @property selectedSS        - Index of stuntsheet currently in view
 * @property fourStepGrid      - View setting to toggle the grapher grid
 * @property grapherSvgPanZoom - Initialized upon mounting Grapher
 * @property invertedCTMMatrix - Used to calculate clientX/Y to SVG X/Y
 * @property toolSelected      - See BaseTool
 * @property grapherToolDots   - Helper dots to help visualize tools
 */
export class CalChartState extends Serializable<CalChartState> {
  show: Show = new Show();

  selectedSS = 0;

  fourStepGrid = true;
  yardlines = true;
  yardlineNumbers = true;

  grapherSvgPanZoom?: SvgPanZoom.Instance;

  invertedCTMMatrix?: DOMMatrix;

  toolSelected?: BaseTool;

  grapherToolDots: StuntSheetDot[] = [];

  constructor(json: Partial<CalChartState> = {}) {
    super();
    this.fromJson(json);
  }
}

export const generateStore
= (json: Partial<CalChartState> = {}): Store<CalChartState> => new Vuex.Store({
  state: new CalChartState(json),
  mutations,
  getters,
});

export const GlobalStore = generateStore();
