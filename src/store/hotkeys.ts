import { CalChartState } from ".";
import { Store } from "vuex";
import { Mutations } from "./mutations";

export const HotKeyHandler = (
  store: Store<CalChartState>,
  event: KeyboardEvent
): void => {
  if (event.key === "ArrowLeft") {
    store.commit(Mutations.DECREMENT_BEAT);
  }
  if (event.key === "ArrowRight") {
    store.commit(Mutations.INCREMENT_BEAT);
  }
  if (event.key === "z" && event.metaKey && !event.shiftKey) {
    store.commit(Mutations.UNDO);
  }
  if (event.key === "z" && event.metaKey && event.shiftKey) {
    store.commit(Mutations.REDO);
  }
};
