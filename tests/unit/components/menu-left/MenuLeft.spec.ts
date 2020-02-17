import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Buefy from 'buefy';
import { generateStore, CalChartState } from '@/store';
import Vuex, { Store } from 'vuex';
import MenuLeft from '@/components/menu-left/MenuLeft.vue';
import Show from '@/models/Show';
import StuntSheet from '@/models/StuntSheet';

describe('components/menu-left/MenuLeft', () => {
  let menu: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let commitSpy: jest.SpyInstance;
  const stuntSheets = [
    new StuntSheet({ beats: 4, title: 'a' }),
    new StuntSheet({ beats: 8, title: 'b' }),
    new StuntSheet({ beats: 12, title: 'c' }),
  ];
  const show = new Show({ stuntSheets });

  beforeEach(() => {
    // Mock out store and mount
    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = generateStore({ show });
    commitSpy = jest.spyOn(store, 'commit');
    menu = mount(MenuLeft, {
      store,
      localVue,
    });
  });

  describe('Beat controls', () => {
    it.each([
      [1, 0],
      [2, 0],
      [1, 1],
      [4, 2],
    ])('Beat control with beat %i and stuntsheet %i', async (
      beat,
      selectedSS,
    ) => {
      store.commit('setBeat', beat);
      store.commit('setSelectedSS', selectedSS);
      await menu.vm.$nextTick();

      const beatControl = menu.find('[data-test="menu-left--beat"]');
      expect(beatControl.exists()).toBeTruthy();
      const selectedSSBeats = stuntSheets[selectedSS].beats;
      expect(beatControl.text())
        .toContain(`Beat: ${beat} / ${selectedSSBeats}`);

      const beatSlider = menu.find('[data-test="menu-left--beat-slider"]');
      expect(beatSlider.exists()).toBeTruthy();
      expect(beatSlider.props('max')).toBe(selectedSSBeats);
      expect(beatSlider.props('value')).toBe(beat);
    });

    it.each([
      ['decrementBeat', 'menu-left--decrement-beat'],
      ['incrementBeat', 'menu-left--increment-beat'],
    ])('Calls %s in store upon clicking button', (commitMsg, selector) => {
      const button = menu.find(`[data-test="${selector}"]`);
      expect(button.exists()).toBeTruthy();
      expect(commitSpy).not.toHaveBeenCalledWith(commitMsg);
      button.trigger('click');
      expect(commitSpy).toHaveBeenCalledWith(commitMsg);
    });
  });

  describe('Stuntsheet controls', () => {
    it('Renders 3 stuntsheet menu items', () => {
      expect(menu.findAll('[data-test="menu-left--ss"]'))
        .toHaveLength(3);
    });

    it.each([
      0,
      1,
      2,
    ])('Correctly renders stuntsheet %i', async (index) => {
      const stuntSheet = stuntSheets[index];
      const menuItem = menu.findAll('[data-test="menu-left--ss"]')
        .at(index);
      expect(menuItem.text()).toContain(`${index + 1}) ${stuntSheet.title}`);
      expect(menuItem.classes('is-active')).toBe(index === 0);

      commitSpy.mockClear();
      menuItem.trigger('click');
      await menu.vm.$nextTick();

      expect(commitSpy).toHaveBeenCalledWith('setSelectedSS', index);
      expect(commitSpy).toHaveBeenCalledWith('setBeat', 1);
      expect(menuItem.classes('is-active')).toBeTruthy();
    });

    it('Clicking the stuntsheet edit icon opens the modal', async () => {
      expect(menu.contains('[data-test="menu-left--ss-modal"]')).toBeFalsy();
      const editSS = menu.find('[data-test="menu-left--ss"] .stuntsheet-edit');
      expect(editSS.exists()).toBeTruthy();

      editSS.trigger('click');
      await menu.vm.$nextTick();

      expect(menu.contains('[data-test="menu-left--ss-modal"]')).toBeTruthy();
    });

    it('Calls addStuntSheet in store upon clicking button', async () => {
      const addButton = menu.find('[data-test="menu-left--add-ss"]');
      expect(addButton.exists()).toBeTruthy();

      commitSpy.mockClear();
      addButton.trigger('click');
      await menu.vm.$nextTick();

      expect(commitSpy).toHaveBeenLastCalledWith(
        'addStuntSheet',
        show.stuntSheets[3],
      );
      expect(menu.findAll('[data-test="menu-left--ss"]'))
        .toHaveLength(4);
    });
  });
});
