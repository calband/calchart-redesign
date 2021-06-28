import { createLocalVue } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import { CalChartState, generateStore } from "@/store";
import { Mutations } from "@/store/mutations";

describe("models/UndoRedo", () => {
  let localVue: VueConstructor<Vue>;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });

  it("testing Undo", () => {
    const store = generateStore({});
    store.state.undoRedo.maxSnapshots = 3;
    expect(store.state.undoRedo.currentShapshot).toBe(0);
    expect(store.state.undoRedo.canUndo()).toBeFalsy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    expect(store.state.undoRedo.undoString()).toBe("");
    expect(store.state.undoRedo.redoString()).toBe("");

    // commit
    store.commit(Mutations.ADD_DOTS, [{ x: 1, y: 1 }]);
    expect(store.state.undoRedo.currentShapshot).toBe(1);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    expect(store.state.undoRedo.undoString()).toBe(Mutations.ADD_DOTS);
    expect(store.state.undoRedo.redoString()).toBe("");

    // undo
    store.commit(Mutations.UNDO);
    expect(store.state.undoRedo.currentShapshot).toBe(0);
    expect(store.state.undoRedo.canUndo()).toBeFalsy();
    expect(store.state.undoRedo.canRedo()).toBeTruthy();
    expect(store.state.undoRedo.undoString()).toBe("");
    expect(store.state.undoRedo.redoString()).toBe(Mutations.ADD_DOTS);

    // undo, should be no-op
    store.commit(Mutations.UNDO);
    expect(store.state.undoRedo.currentShapshot).toBe(0);
    expect(store.state.undoRedo.canUndo()).toBeFalsy();
    expect(store.state.undoRedo.canRedo()).toBeTruthy();
    expect(store.state.undoRedo.undoString()).toBe("");
    expect(store.state.undoRedo.redoString()).toBe(Mutations.ADD_DOTS);

    // redo
    store.commit(Mutations.REDO);
    expect(store.state.undoRedo.currentShapshot).toBe(1);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    expect(store.state.undoRedo.undoString()).toBe(Mutations.ADD_DOTS);
    expect(store.state.undoRedo.redoString()).toBe("");

    // redo, should be no-op
    store.commit(Mutations.REDO);
    expect(store.state.undoRedo.currentShapshot).toBe(1);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    expect(store.state.undoRedo.undoString()).toBe(Mutations.ADD_DOTS);
    expect(store.state.undoRedo.redoString()).toBe("");

    // commit
    store.commit(Mutations.SET_STUNT_SHEET_BEATS, { beats: 8 });
    expect(store.state.undoRedo.currentShapshot).toBe(2);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    expect(store.state.undoRedo.undoString()).toBe(
      Mutations.SET_STUNT_SHEET_BEATS
    );
    expect(store.state.undoRedo.redoString()).toBe("");

    // commit
    store.commit(Mutations.UNDO);
    expect(store.state.undoRedo.currentShapshot).toBe(1);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeTruthy();
    expect(store.state.undoRedo.undoString()).toBe(Mutations.ADD_DOTS);
    expect(store.state.undoRedo.redoString()).toBe(
      Mutations.SET_STUNT_SHEET_BEATS
    );

    // commit
    store.commit(Mutations.SET_STUNT_SHEET_TITLE, { title: "new show" });
    expect(store.state.undoRedo.currentShapshot).toBe(2);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    expect(store.state.undoRedo.undoString()).toBe(
      Mutations.SET_STUNT_SHEET_TITLE
    );
    expect(store.state.undoRedo.redoString()).toBe("");

    // commit
    store.commit(Mutations.SET_STUNT_SHEET_TITLE, { title: "Other show" });
    expect(store.state.undoRedo.currentShapshot).toBe(2);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    expect(store.state.undoRedo.undoString()).toBe(
      Mutations.SET_STUNT_SHEET_TITLE
    );
    expect(store.state.undoRedo.redoString()).toBe("");
  });

  it("testing Max Undos", () => {
    const store = generateStore({});
    const maxSnapshots = 10;
    store.state.undoRedo.maxSnapshots = maxSnapshots;
    expect(store.state.undoRedo.maxSnapshots).toBe(maxSnapshots);
    expect(store.state.undoRedo.currentShapshot).toBe(0);
    expect(store.state.undoRedo.stateSnapshots[0][1]).toBe("");
    expect(store.state.undoRedo.canUndo()).toBeFalsy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((element) => {
      store.commit(Mutations.ADD_DOTS, [{ x: element, y: element }]);
    });
    expect(store.state.undoRedo.currentShapshot).toBe(maxSnapshots - 1);
    expect(store.state.undoRedo.stateSnapshots[9][1]).toBe(Mutations.ADD_DOTS);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
    for (let i = 0; i < maxSnapshots; i++) {
      store.commit(Mutations.UNDO);
    }
    expect(store.state.undoRedo.currentShapshot).toBe(0);
    expect(store.state.undoRedo.canUndo()).toBeFalsy();
    expect(store.state.undoRedo.canRedo()).toBeTruthy();

    store.commit(Mutations.ADD_DOTS, [{ x: 12, y: 12 }]);
    expect(store.state.undoRedo.currentShapshot).toBe(1);
    expect(store.state.undoRedo.stateSnapshots[1][1]).toBe(Mutations.ADD_DOTS);
    expect(store.state.undoRedo.canUndo()).toBeTruthy();
    expect(store.state.undoRedo.canRedo()).toBeFalsy();
  });
});
