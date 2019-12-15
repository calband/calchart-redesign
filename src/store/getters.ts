import { CalChartState } from '.';

export default {
  // Show
  getShowTitle: (state: CalChartState) => state.show.title,

  // Show -> Field
  getFrontHashOffsetY: (state: CalChartState) => state.show.field.frontHashOffsetY,
  getBackHashOffsetY: (state: CalChartState) => state.show.field.backHashOffsetY,
  getMiddleOfField: (state: CalChartState) => state.show.field.middleOfField,
};
