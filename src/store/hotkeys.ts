import { CalChartState } from ".";
import { Store } from "vuex";

export const HotKeyHandler = (
  store: Store<CalChartState>,
  event: KeyboardEvent
): void => {
  if (event.key === "ArrowLeft") {
    store.commit("decrementBeat");
  }
  if (event.key === "ArrowRight") {
    store.commit("incrementBeat");
  }
};
