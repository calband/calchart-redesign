/**
 * Global variables that do not need to be stored in the Vuex store
 */
interface GlobalsType {
  grapherSvgPanZoom: SvgPanZoom.Instance | null;
}

export const GLOBALS: GlobalsType = {
  grapherSvgPanZoom: null,
};
