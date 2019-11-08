import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    hashMarkOffsetsY: [32, 52],
    middleOfField: 50,
    fourStepGrid: true,
    settingsModal: false
  },
  mutations: {
    setSettingsModal(state, enabled: boolean) {
      state.settingsModal = enabled;
    },
    setFrontHash(state, offsetY: number) {
      state.hashMarkOffsetsY = [offsetY, state.hashMarkOffsetsY[1]];
    },
    setBackHash(state, offsetY: number) {
      state.hashMarkOffsetsY = [state.hashMarkOffsetsY[0], offsetY];
    },
    setMiddleOfField(state, middle: number) {
      state.middleOfField = middle;
    },
    setFourStepGrid(state, enabled: boolean) {
      state.fourStepGrid = enabled;
    },
  },
  actions: {
  },
  modules: {
  },
});
