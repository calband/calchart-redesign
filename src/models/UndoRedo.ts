import { Mutations, UNDOABLE_ACTIONS } from "@/store/mutations";
import { CalChartState } from "@/store";
import Serializable from "./util/Serializable";
import { MutationPayload, Store } from "vuex";
import Show from "./Show";

// Increment upon making show metadata changes that break previous versions.
const METADATA_VERSION = 1;

/**
 *  The UndoRedo holds snapshots of the show over time.
 *
 * States are held as pairs of the show, and the action that happened to get
 * to that show.  This is useful for displaying that information to the user
 * so they know what the undo/do action will do.
 *
 * shapshots
 * ----------------------------------------------------------
 * | state0, "action" | state1, "action" | state2, "action" |
 * ----------------------------------------------------------
 *                            ^
 * currentSnapshot == 1 ------+
 *
 * When a new undoable commit occurs, UndoRedo will snapshot the current state
 * and append it to the end if there is room.  Otherwise, we shift the entire
 * undo state by one to make room.
 *
 * if a new undoable commit happens when you are in the middle of an undo stack
 * (for instance, you've undo a move and then do another move), we remove all
 * the items after the current snapshot and start appending from there.
 *
 *
 * here is a diagram of what we expect to occur with a series of commits, undo, redo actions.
 *
 * snapshots
 * --------------------
 * | initialState, "" |
 * --------------------
 * currentSnapshot == 0
 * Undoable should be 0, redoable should be 0
 *
 * commit
 * Set currentShapshot forward by 1.  preserve [0, currentSnapshot+1).  Append new state.
 * snapshots.
 * ---------------------------------------
 * | initialState, "" | state0, "action" |
 * ---------------------------------------
 * currentSnapshot == 1
 * undoable should be 1, redoable should be 0
 *
 * undo:
 * Set currentSnapshot back by 1.  restore state at currentSnapshot.
 * snapshots
 * ---------------------------------------
 * | initialState, "" | state0, "action" |
 * ---------------------------------------
 * currentSnapshot == 0
 * undoable should be 0, redoable should be 1
 *
 * undo:
 * Should be no-op
 * snapshots
 * ---------------------------------------
 * | initialState, "" | state0, "action" |
 * ---------------------------------------
 * currentSnapshot == 0
 * undoable should be 0, redoable should be 1
 *
 * redo:
 * Set currentSnapshot forward by 1.  restore state at currentSnapshot.
 * snapshots
 * ---------------------------------------
 * | initialState, "" | state0, "action" |
 * ---------------------------------------
 * currentSnapshot == 1
 * undoable should be 1, redoable should be 0
 *
 * redo:
 * Should be no-op
 * snapshots
 * ---------------------------------------
 * | initialState, "" | state0, "action" |
 * ---------------------------------------
 * currentSnapshot == 1
 * undoable should be 1, redoable should be 0
 *
 * commit
 * Set currentShapshot forward by 1.  preserve [0, currentSnapshot+1).  Append new state.
 * snapshots
 * ----------------------------------------------------------
 * | initialState, "" | state0, "action" | state1, "action" |
 * ----------------------------------------------------------
 * currentSnapshot == 2
 * undoable should be 1, redoable should be 0
 *
 * undo:
 * restore state at currentSnapshot.  Set currentSnapshot back by 1
 * snapshots
 * ----------------------------------------------------------
 * | initialState, "" | state0, "action" | state1, "action" |
 * ----------------------------------------------------------
 * currentSnapshot == 1
 * undoable should be 1, redoable should be 1
 *
 * commit
 * Set currentShapshot forward by 1.  preserve [0, currentSnapshot+1).  Append new state.
 * snapshots
 * ----------------------------------------------------------
 * | initialState, "" | state0, "action" | state2, "action" |
 * ----------------------------------------------------------
 * currentSnapshot == 2
 * undoable should be 1, redoable should be 0
 *
 * assume limit of 3
 * commit
 * rotate snapshots by 1 left.  override new state at currentShapshot-1.
 * snapshots
 * ----------------------------------------------------------
 * | state0, "action" | state2, "action" | state3, "action" |
 * ----------------------------------------------------------
 * currentSnapshot == 2
 * undoable should be 1, redoable should be 0
 *
 * Inspiration for the undo system from https://vuejsdevelopers.com/2017/11/13/vue-js-vuex-undo-redo/
 */

export class UndoRedo extends Serializable<UndoRedo> {
  metadataVersion: number = METADATA_VERSION;

  // probably needs to be a pair, one of the state, and one describing what just happened.
  stateSnapshots: [string, string][] = [];
  currentShapshot = 0;
  maxSnapshots = 10;

  constructor(json: Partial<UndoRedo> = {}) {
    super();
    this.fromJson(json);
  }

  canUndo(): boolean {
    return this.currentShapshot > 0;
  }

  undoString(): string {
    // going to need to be a string that got us to this state.
    return this.canUndo() ? this.stateSnapshots[this.currentShapshot][1] : "";
  }

  canRedo(): boolean {
    return this.currentShapshot < this.stateSnapshots.length - 1;
  }

  redoString(): string {
    // going to need to be the string of the next snapshot state.
    return this.canRedo()
      ? this.stateSnapshots[this.currentShapshot + 1][1]
      : "";
  }

  reinitializeUndoRedo(show: Show): void {
    this.stateSnapshots = [[JSON.stringify(show), ""]];
    this.currentShapshot = 0;
  }

  createPlugin() {
    return (store: Store<CalChartState>): void => {
      this.reinitializeUndoRedo(store.state.show);
      // called when the store is initialized
      // State could be useful in the future.
      store.subscribe((
        mutation: MutationPayload /*, state: CalChartState */
      ) => {
        if (UNDOABLE_ACTIONS.includes(mutation.type as Mutations)) {
          if (this.currentShapshot + 1 === this.maxSnapshots) {
            this.stateSnapshots.shift();
          } else {
            this.currentShapshot = this.currentShapshot + 1;
            this.stateSnapshots = this.stateSnapshots.slice(
              0,
              this.currentShapshot
            );
          }
          this.stateSnapshots.push([
            JSON.stringify(store.state.show),
            mutation.type,
          ]);
        }
        if (mutation.type === Mutations.UNDO) {
          if (!this.canUndo()) {
            return;
          }
          this.currentShapshot = this.currentShapshot - 1;
          store.commit(
            Mutations.SET_SHOW,
            new Show(JSON.parse(this.stateSnapshots[this.currentShapshot][0]))
          );
        }
        if (mutation.type === Mutations.REDO) {
          if (!this.canRedo()) {
            return;
          }
          this.currentShapshot = this.currentShapshot + 1;
          store.commit(
            Mutations.SET_SHOW,
            new Show(JSON.parse(this.stateSnapshots[this.currentShapshot][0]))
          );
        }
      });
    };
  }
}
