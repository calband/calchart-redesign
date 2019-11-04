import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const generateYardLines = (middleOfField: number = 50): number[] => {
  const yardLines: number[] = [];
  let x = 16;
  for (let lineNum = 0; lineNum < middleOfField; lineNum += 5) {
    yardLines.push(x);
    x += 8;
  }
  for (let lineNum = middleOfField; lineNum >= 0; lineNum -= 5) {
    yardLines.push(x);
    x += 8;
  }
  return yardLines;
};

export default new Vuex.Store({
  state: {
    hashMarks: [32, 52],
    yardLines: generateYardLines(),
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
});
