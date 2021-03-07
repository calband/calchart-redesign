import { CalChartState } from ".";
import { Store } from "vuex";
import { Mutations } from "./mutations";
import InitialShowState from "@/models/InitialShowState";

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
  if (event.key === "n" && event.ctrlKey) {
    store.commit(Mutations.SET_SHOW, new InitialShowState());
  }
};
