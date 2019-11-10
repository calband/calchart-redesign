import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export interface stateType {
  hashMarkOffsetsY: [number, number],
  middleOfField: number,
  fourStepGrid: boolean,
  fileModal: boolean
}

// TODO: Is there a better way to do defaults?
interface assignedStateType {
  hashMarkOffsetsY?: [number, number],
  middleOfField?: number,
  fourStepGrid?: boolean,
  fileModal?: boolean
}

export const initialState = (assignedState?: assignedStateType): stateType => {
  const defaultState: stateType = {
    hashMarkOffsetsY: [32, 52],
    middleOfField: 50,
    fourStepGrid: true,
    fileModal: false,
  };
  return Object.assign(JSON.parse(JSON.stringify(defaultState)), assignedState);
};

export const mutations = {
  setFileModal(state: stateType, enabled: boolean) {
    state.fileModal = enabled;
  },
  setFrontHash(state: stateType, offsetY: number) {
    state.hashMarkOffsetsY = [offsetY, state.hashMarkOffsetsY[1]];
  },
  setBackHash(state: stateType, offsetY: number) {
    state.hashMarkOffsetsY = [state.hashMarkOffsetsY[0], offsetY];
  },
  setMiddleOfField(state: stateType, middle: number) {
    state.middleOfField = middle;
  },
  setFourStepGrid(state: stateType, enabled: boolean) {
    state.fourStepGrid = enabled;
  },
};

export default new Vuex.Store({
  state: initialState(),
  mutations,
});
