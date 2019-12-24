import { CalChartState } from '.';

export default {
  // Show
  getShowTitle: (state: CalChartState): string => state.show.title,

  // Show -> Field
  getFrontHashOffsetY: (state: CalChartState): number => state.show.field.frontHashOffsetY,
  getBackHashOffsetY: (state: CalChartState): number => state.show.field.backHashOffsetY,
  getMiddleOfField: (state: CalChartState): number => state.show.field.middleOfField,
};
