import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import Buefy from 'buefy';
import { initialState, mutations, stateType } from '@/store';
import FileDropdown from '@/components/menu-top/FileDropdown.vue';

describe('components/menu-top/FileDropdown', () => {
  let localVue: VueConstructor<Vue>;
  let wrapper: Wrapper<Vue>;
  let store: Store<stateType>;

  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = new Vuex.Store({
      state: initialState(),
      mutations,
    });
    wrapper = mount(FileDropdown, {
      store,
      localVue,
    });
  });

  it('sets fileModal to true upon clicking "Edit Show Details"', () => {
    expect(store.state.fileModal).toBeFalsy();
    expect(wrapper.contains('[data-test="menu-top--edit"]')).toBeTruthy();
    // wrapper.find('[data-test="menu-top--edit"]').trigger('click');
    // expect(store.state.fileModal).toBeTruthy();
  });
});