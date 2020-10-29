import { CalChartState, generateStore } from "@/store";
import { Store } from "vuex";
import Show from "@/models/Show";
import StuntSheet from "@/models/StuntSheet";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import ContEven from "@/models/continuity/ContEven";
import StuntSheetDot from "@/models/StuntSheetDot";

describe("store/mutations", () => {
  let store: Store<CalChartState>;

  describe("syncDotLabelIndices", () => {
    // TODO: Update and add tests upon updating syncDotLabelIndices
    beforeEach(() => {
      store = generateStore({
        show: new Show({
          stuntSheets: [
            new StuntSheet({
              dotTypes: [[new ContETFDynamic(), new ContInPlace()]],
              stuntSheetDots: [
                new StuntSheetDot({ x: 0, y: 0 }),
                new StuntSheetDot({ x: 2, y: 2 }),
              ],
            }),
            new StuntSheet({
              stuntSheetDots: [
                new StuntSheetDot({ x: 0, y: 4 }),
                new StuntSheetDot({ x: 2, y: 4 }),
              ],
            }),
          ],
        }),
      });
    });

    it("updates current and next dot label indices", () => {
      const dots = store.state.show.stuntSheets[0].stuntSheetDots;
      expect(dots[0].dotLabelIndex).toBeNull();
      expect(dots[1].dotLabelIndex).toBeNull();
      store.commit("syncDotLabelIndices", {
        currentSSDotIndex: 1,
        nextSSDotIndex: 0,
      });
      const updatedDots = store.state.show.stuntSheets[0].stuntSheetDots;
      expect(updatedDots[0].dotLabelIndex).toBeNull();
      expect(updatedDots[1].dotLabelIndex).toBe(0);
      const nextSSDots = store.state.show.stuntSheets[1].stuntSheetDots;
      expect(nextSSDots[0].dotLabelIndex).toBe(0);
      expect(nextSSDots[1].dotLabelIndex).toBeNull();
    });
  });

  describe("addDotType", () => {
    beforeEach(() => {
      store = generateStore({
        show: new Show({
          stuntSheets: [
            new StuntSheet({
              dotTypes: [[new ContInPlace()], [new ContETFDynamic()]],
            }),
          ],
        }),
        selectedSS: 0,
      });
    });

    it("adds a new dot type to the end of the array", () => {
      expect(store.state.show.stuntSheets[0].dotTypes).toHaveLength(2);
      store.commit("addDotType");
      expect(store.state.show.stuntSheets[0].dotTypes).toHaveLength(3);
    });
  });

  describe("addContinuity", () => {
    beforeEach(() => {
      store = generateStore({
        show: new Show({
          stuntSheets: [
            new StuntSheet({
              dotTypes: [[new ContInPlace()], [new ContETFDynamic()]],
            }),
            new StuntSheet(),
          ],
        }),
        selectedSS: 0,
      });
    });

    it("adds the new continuity to the end of the array", () => {
      const oldDotTypes = store.state.show.stuntSheets[0].dotTypes;
      expect(oldDotTypes[0]).toHaveLength(1);
      expect(oldDotTypes[0][0] instanceof ContInPlace).toBe(true);
      expect(oldDotTypes[1]).toHaveLength(1);
      expect(oldDotTypes[1][0] instanceof ContETFDynamic).toBe(true);
      store.commit("addContinuity", {
        dotTypeIndex: 1,
        continuity: new ContEven(),
      });
      const newDotTypes = store.state.show.stuntSheets[0].dotTypes;
      expect(newDotTypes[0]).toHaveLength(1);
      expect(newDotTypes[0][0] instanceof ContInPlace).toBe(true);
      expect(newDotTypes[1]).toHaveLength(2);
      expect(newDotTypes[1][0] instanceof ContETFDynamic).toBe(true);
      expect(newDotTypes[1][1] instanceof ContEven).toBe(true);
    });
  });

  describe("updateDotTypeContinuity", () => {
    beforeEach(() => {
      store = generateStore({
        show: new Show({
          stuntSheets: [
            new StuntSheet({
              dotTypes: [[new ContInPlace()], [new ContETFDynamic()]],
            }),
            new StuntSheet(),
          ],
        }),
        selectedSS: 0,
      });
    });

    it("updates continuity at the specified indices", () => {
      const oldDotTypes = store.state.show.stuntSheets[0].dotTypes;
      expect(oldDotTypes[0]).toHaveLength(1);
      expect(oldDotTypes[0][0] instanceof ContInPlace).toBe(true);
      expect(oldDotTypes[0][0].duration).toBe(0);
      expect(oldDotTypes[1]).toHaveLength(1);
      expect(oldDotTypes[1][0] instanceof ContETFDynamic).toBe(true);
      store.commit("updateDotTypeContinuity", {
        dotTypeIndex: 0,
        continuityIndex: 0,
        continuity: new ContInPlace({ duration: 8 }),
      });
      const newDotTypes = store.state.show.stuntSheets[0].dotTypes;
      expect(newDotTypes[0]).toHaveLength(1);
      expect(newDotTypes[0][0] instanceof ContInPlace).toBe(true);
      expect(oldDotTypes[0][0].duration).toBe(8);
      expect(newDotTypes[1]).toHaveLength(1);
      expect(newDotTypes[1][0] instanceof ContETFDynamic).toBe(true);
    });
  });

  describe("deleteDotTypeContinuity", () => {
    beforeEach(() => {
      store = generateStore({
        show: new Show({
          stuntSheets: [
            new StuntSheet({
              dotTypes: [[new ContInPlace(), new ContETFDynamic()]],
            }),
            new StuntSheet(),
          ],
        }),
        selectedSS: 0,
      });
    });

    it("updates continuity at the specified indices", () => {
      const oldDotTypes = store.state.show.stuntSheets[0].dotTypes;
      expect(oldDotTypes[0]).toHaveLength(2);
      expect(oldDotTypes[0][0] instanceof ContInPlace).toBe(true);
      expect(oldDotTypes[0][1] instanceof ContETFDynamic).toBe(true);
      store.commit("deleteDotTypeContinuity", {
        dotTypeIndex: 0,
        continuityIndex: 0,
      });
      const newDotTypes = store.state.show.stuntSheets[0].dotTypes;
      expect(newDotTypes[0]).toHaveLength(1);
      expect(newDotTypes[0][0] instanceof ContETFDynamic).toBe(true);
    });
  });

  describe("incrementBeat", () => {
    beforeAll(() => {
      const stuntSheets = [
        new StuntSheet({ beats: 2 }),
        new StuntSheet({ beats: 2 }),
      ];
      store = generateStore({
        show: new Show({ stuntSheets }),
        selectedSS: 0,
        beat: 2,
      });
    });

    it("increments selectedSS at the end of stuntsheet", () => {
      store.commit("incrementBeat");
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(1);
    });

    it("increments beat in the middle of a stuntsheet", () => {
      store.commit("incrementBeat");
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(2);
    });

    it("does nothing at end of show", () => {
      store.commit("incrementBeat");
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(2);
    });
  });

  describe("decrementBeat", () => {
    beforeAll(() => {
      const stuntSheets = [
        new StuntSheet({ beats: 2 }),
        new StuntSheet({ beats: 2 }),
      ];
      store = generateStore({
        show: new Show({ stuntSheets }),
        selectedSS: 1,
        beat: 1,
      });
    });

    it("decrements selectedSS at the beginning of stuntsheet", () => {
      store.commit("decrementBeat");
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(2);
    });

    it("decrements beat in the middle of a stuntsheet", () => {
      store.commit("decrementBeat");
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(1);
    });

    it("does nothing at beginning of show", () => {
      store.commit("decrementBeat");
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(1);
    });
  });
});
