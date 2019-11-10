import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import Buefy from 'buefy';
import { initialState, mutations, stateType } from '@/store';
import MenuTop from '@/components/menu-top/MenuTop.vue';

describe('components/menu-top/MenuTop', () => {
  let localVue: VueConstructor<Vue>;
  let wrapper: Wrapper<Vue>;
  let store: Store<stateType>;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = new Vuex.Store({
      state: initialState(),
      mutations,
    });
    wrapper = mount(MenuTop, {
      store,
      localVue,
    });
  });

  describe('file dropdown', () => {
    it('sets fileModal to true upon clicking "Edit Show Details"', () => {
      expect(store.state.fileModal).toBeFalsy();
      expect(wrapper.contains('[data-test="menu-top--file-edit"]')).toBeTruthy();
      wrapper.find('[data-test="menu-top--file-edit"]').trigger('click');
      expect(store.state.fileModal).toBeTruthy();
    });
  });

  describe('view dropdown', () => {
    it('four step grid checkbox', () => {
      expect(store.state.fourStepGrid).toBeTruthy();
      expect(wrapper.contains('[data-test="menu-top--view-grid"]')).toBeTruthy();
      wrapper.find('[data-test="menu-top--view-grid"]').trigger('click');
      expect(store.state.fourStepGrid).toBeFalsy();
    });
  });
});
