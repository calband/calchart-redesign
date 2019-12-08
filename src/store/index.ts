import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { stateType } from './types';
import mutations from './mutations';
import getters from './getters';
import Show from '@/models/Show';

Vue.use(Vuex);

const initialState = (assignedState: Partial<stateType>): stateType => {
  const defaultState: stateType = {
    show: new Show(),
    fourStepGrid: true,
  };
  return Object.assign(JSON.parse(JSON.stringify(defaultState)), assignedState);
};

export const generateStore = (
  assignedState: Partial<stateType>,
): Store<stateType> => new Vuex.Store({
  state: initialState(assignedState),
  mutations,
  getters,
});

export default generateStore({});
