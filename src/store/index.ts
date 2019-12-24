import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import mutations from './mutations';
import getters from './getters';
import Show from '@/models/Show';
import Serializable from '@/models/util/Serializable';

Vue.use(Vuex);

/**
 * Defines the global state for the application
 *
 * @property show         - The currently selected show data
 * @property fourStepGrid - View setting to toggle the grapher grid
 */
export class CalChartState extends Serializable<CalChartState> {
  show: Show = new Show();

  fourStepGrid: boolean = true;

  constructor(json: Partial<CalChartState> = {}) {
    super();
    this.fromJson(json);
  }
}

export const generateStore = (json: Partial<CalChartState> = {}): Store<CalChartState> => new Vuex.Store({
  state: new CalChartState(json),
  mutations,
  getters,
});

export default generateStore();
