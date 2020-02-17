import { CalChartState, generateStore } from '@/store';
import { Store } from 'vuex';
import Show from '@/models/Show';
import StuntSheet from '@/models/StuntSheet';

describe('store/mutations', () => {
  describe('incrementBeat', () => {
    let store: Store<CalChartState>;
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

    it('increments selectedSS at the end of stuntsheet', () => {
      store.commit('incrementBeat');
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(1);
    });

    it('increments beat in the middle of a stuntsheet', () => {
      store.commit('incrementBeat');
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(2);
    });

    it('does nothing at end of show', () => {
      store.commit('incrementBeat');
      expect(store.state.selectedSS).toBe(1);
      expect(store.state.beat).toBe(2);
    });
  });

  describe('decrementBeat', () => {
    let store: Store<CalChartState>;
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

    it('decrements selectedSS at the beginning of stuntsheet', () => {
      store.commit('decrementBeat');
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(2);
    });

    it('decrements beat in the middle of a stuntsheet', () => {
      store.commit('decrementBeat');
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(1);
    });

    it('does nothing at beginning of show', () => {
      store.commit('decrementBeat');
      expect(store.state.selectedSS).toBe(0);
      expect(store.state.beat).toBe(1);
    });
  });
});
