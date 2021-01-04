import { UNDO, REDO, UNDOABLE_ACTIONS } from "@/store/mutations"
import { CalChartState } from "@/store";
import Serializable from "./util/Serializable";
import { Store } from "vuex";

// Increment upon making show metadata changes that break previous versions.
const METADATA_VERSION = 1;

// The UndoRedo holds the initial state of the show and all new changes
// built on it.  It provides the long history of the show as it was created.
// https://vuejsdevelopers.com/2017/11/13/vue-js-vuex-undo-redo/
export class UndoRedo extends Serializable<UndoRedo> {
  metadataVersion: number = METADATA_VERSION;

  done: { mutationType: string; stateString: string }[] = [];
  undone: { mutationType: string; stateString: string }[] = [];
  newMutation = true;

  constructor(json: Partial<UndoRedo> = {}) {
    super();
    this.fromJson(json);
  }

  canUndo(): boolean {
    return this.done.length > 0;
  }

  undoString(): string {
    return this.done.length ? this.done[this.done.length - 1].mutationType : "";
  }

  canRedo(): boolean {
    return this.undone.length > 0;
  }

  redoString(): string {
    return this.undone.length ? this.undone[this.undone.length - 1].mutationType : "";
  }

  createPlugin () {
    return (store: Store<CalChartState>): void => {
      let lastStateString = JSON.stringify(store.state);

      // called when the store is initialized
      store.subscribe((mutation: { type: string, payload: any }, state: CalChartState) => {
        if (UNDOABLE_ACTIONS.includes(mutation.type)) {
          this.done.push({ mutationType: mutation.type, stateString: lastStateString });
          this.undone = [];
        } else if (mutation.type === UNDO) {
          const lastDone = this.done.pop()
          if (!lastDone) {
            return;
          }
          const lastState = new CalChartState(JSON.parse(lastDone.stateString));
          this.undone.push({ mutationType: lastDone.mutationType, stateString: JSON.stringify(store.state) });
          Object.entries(lastState).forEach(([key, value]) => {
            if (key === 'undoRedo') {
              return;
            }
            state[key] = value;
          });
        } else if (mutation.type === REDO) {
          const nextUndone = this.undone.pop();
          if (!nextUndone) {
            return;
          }
          const nextState = new CalChartState(JSON.parse(nextUndone.stateString));
          this.done.push({ mutationType: nextUndone.mutationType, stateString: JSON.stringify(store.state) });
          Object.entries(nextState).forEach(([key, value]) => {
            if (key === 'undoRedo') {
              return;
            }
            state[key] = value;
          });
        }
        lastStateString = JSON.stringify(store.state);
      })
    }
  }
}
