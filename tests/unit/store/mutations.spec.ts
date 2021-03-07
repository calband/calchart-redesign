import { CalChartState, generateStore } from "@/store";
import { Store } from "vuex";
import Show from "@/models/Show";
import StuntSheet from "@/models/StuntSheet";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import ContEven from "@/models/continuity/ContEven";
import DotAppearance from "@/models/DotAppearance";
import { Mutations } from "@/store/mutations";
import { CONT_IDS } from "@/models/continuity/BaseCont";

describe("store/mutations", () => {
  let store: Store<CalChartState>;

  describe("addDotType", () => {
    beforeEach(() => {
      store = generateStore({
        show: new Show({
          stuntSheets: [
            new StuntSheet({
              dotTypes: [[new ContInPlace()], [new ContETFDynamic()]],
              dotAppearances: [new DotAppearance(), new DotAppearance()],
            }),
          ],
        }),
        selectedSS: 0,
      });
    });

    it("adds a new dot type to the end of the array", () => {
      expect(store.state.show.stuntSheets[0].dotTypes).toHaveLength(2);
      store.commit(Mutations.ADD_DOT_TYPE);
      expect(store.state.show.stuntSheets[0].dotTypes).toHaveLength(3);
    });
    it("adds a new dot appereance to the end of the array", () => {
      expect(store.state.show.stuntSheets[0].dotAppearances).toHaveLength(2);
      store.commit(Mutations.ADD_DOT_TYPE);
      expect(store.state.show.stuntSheets[0].dotAppearances).toHaveLength(3);
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
      store.commit(Mutations.ADD_CONTINUITY, {
        dotTypeIndex: 1,
        contID: CONT_IDS.EVEN,
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
      store.commit(Mutations.UPDATE_DOT_TYPE_DURATION, {
        dotTypeIndex: 0,
        continuityIndex: 0,
        duration: 8,
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
      store.commit(Mutations.DELETE_DOT_TYPE_CONTINUITY, {
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
        beat: 1,
      });
    });

    it("increments selectedSS at the end of stuntsheet", () => {
      store.commit(Mutations.INCREMENT_BEAT);
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(0);
    });

    it("increments beat in the middle of a stuntsheet", () => {
      store.commit(Mutations.INCREMENT_BEAT);
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(1);
    });

    it("does nothing at end of show", () => {
      store.commit(Mutations.INCREMENT_BEAT);
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(2);
      store.commit(Mutations.INITIAL_SHOW_STATE);
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
        beat: 0,
      });
    });

    it("decrements selectedSS at the beginning of stuntsheet", () => {
      store.commit(Mutations.DECREMENT_BEAT);
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(1);
    });

    it("decrements beat in the middle of a stuntsheet", () => {
      store.commit(Mutations.DECREMENT_BEAT);
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(0);
    });

    it("does nothing at beginning of show", () => {
      store.commit(Mutations.DECREMENT_BEAT);
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(0);
    });
  });
});
