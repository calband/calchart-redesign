import { CalChartState } from '.';

/**
 * To access the class methods of any property in state, initialize it again.
 * See Serializable.
 */

export default {
  // Show
  setShow(state: CalChartState, show: Show): void {
    state.show = show;
  },

  setShowTitle(state: CalChartState, title: string): void {
    state.show.title = title;
  },

  // Show -> Field
  setFrontHashOffsetY(state: CalChartState, offsetY: number): void {
    state.show.field.frontHashOffsetY = offsetY;
  },
  setBackHashOffsetY(state: CalChartState, offsetY: number): void {
    state.show.field.backHashOffsetY = offsetY;
  },
  setMiddleOfField(state: CalChartState, middle: number): void {
    state.show.field.middleOfField = middle;
  },

  // View Settings
  setFourStepGrid(state: CalChartState, enabled: boolean): void {
    state.fourStepGrid = enabled;
  },
};
