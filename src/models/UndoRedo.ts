import { INITIAL_SHOW_STATE, UNDO, REDO, UNDOABLE_ACTIONS } from "@/store/mutations"
import { CalChartState } from "@/store";
import Serializable from "./util/Serializable";

// Increment upon making show metadata changes that break previous versions.
const METADATA_VERSION = 1;

// The UndoRedo holds the initial state of the show and all new changes
// built on it.  It provides the long history of the show as it was created.
// https://vuejsdevelopers.com/2017/11/13/vue-js-vuex-undo-redo/
export class UndoRedo extends Serializable<UndoRedo> {
  metadataVersion: number = METADATA_VERSION;

  done: any[] = [];
  undone: any[] = [];
  newMutation = true;

  constructor(json: Partial<UndoRedo> = {}) {
    super();
    this.fromJson(json);
  }

  canUndo(): boolean {
    return this.done.length > 0;
  }

  undoString(): string {
    return this.done.length ? this.done[this.done.length - 1].type : "";
  }

  canRedo(): boolean {
    return this.undone.length > 0;
  }

  redoString(): string {
    return this.undone.length ? this.undone[this.undone.length - 1].type : "";
  }

  createPlugin () {
    return (store: any) => {
      // called when the store is initialized
      store.subscribe((mutation: any, state: CalChartState) => {
        if (UNDOABLE_ACTIONS.includes(mutation.type)) {
          console.log( "adding mutation: ", mutation);
          this.done.push(mutation);
          if (this.newMutation) {
            this.undone = [];
          }
        }
        if (mutation.type === UNDO) {
          let lastAction = this.done.pop()
          if (!lastAction) {
            return;
          }
          this.undone.push(lastAction);
          this.newMutation = false;
          store.commit(INITIAL_SHOW_STATE);
          this.done.forEach((mutant: any) => {
            store.commit(`${mutant.type}`, mutant.payload);
            this.done.pop();
          });
          this.newMutation = true;
        }
        if (mutation.type === REDO) {
          let commit = this.undone.pop();
          if (commit && commit) {
            this.newMutation = false;
            store.commit(`${commit.type}`, commit.payload);
            this.newMutation = true;
          }
        }
      })
    }
  }
}
