import Show from '@/models/Show';
import { CalChartState } from '.';

/**
 * To access the class methods of any property in state, initialize it again. See Serializable.
 */

export default {
  // Show
  setShowTitle(state: CalChartState, title: string) {
    state.show.title = title;
  },

  // Show -> Field
  setFrontHashOffsetY(state: CalChartState, offsetY: number) {
    state.show.field.frontHashOffsetY = offsetY;
  },
  setBackHashOffsetY(state: CalChartState, offsetY: number) {
    state.show.field.backHashOffsetY = offsetY;
  },
  setMiddleOfField(state: CalChartState, middle: number) {
    state.show.field.middleOfField = middle;
  },

  // View Settings
  setFourStepGrid(state: CalChartState, enabled: boolean) {
    state.fourStepGrid = enabled;
  },
};
