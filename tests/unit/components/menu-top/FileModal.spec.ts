import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import Buefy from 'buefy';
import { initialState, mutations, stateType } from '@/store';
import FileModal from '@/components/menu-top/FileModal.vue';

describe('components/menu-top/FileModal', () => {
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
    wrapper = mount(FileModal, {
      store,
      localVue,
    });
  });

  it('modal is synced with fileModal', () => {
    expect(wrapper.find('.modal-card').exists()).toBeFalsy();
    store.commit('setFileModal', true);
    expect(wrapper.find('.modal-card').exists()).toBeTruthy();
  });

  describe('fileModal is true', () => {
    beforeEach(() => {
      store.commit('setFileModal', true);
    });

    it('setting: frontHashOffsetY', async () => {
      const frontHashOffsetY = wrapper.find('[name="frontHashOffsetY"]');
      expect(frontHashOffsetY.exists()).toBeTruthy();
      const frontHashOffsetYElement = <HTMLInputElement>(frontHashOffsetY.element);
      expect(frontHashOffsetYElement.value).toBe('32');
      expect(store.state.hashMarkOffsetsY).toEqual([32, 52]);
      frontHashOffsetY.setValue(28);
      expect(frontHashOffsetYElement.value).toBe('28');
      return Vue.nextTick().then(() => {
        expect(store.state.hashMarkOffsetsY).toEqual([28, 52]);
      });
    });

    it('setting: backHashOffsetY', async () => {
      const backHashOffsetY = wrapper.find('[name="backHashOffsetY"]');
      expect(backHashOffsetY.exists()).toBeTruthy();
      const backHashOffsetYElement = <HTMLInputElement>(backHashOffsetY.element);
      expect(backHashOffsetYElement.value).toBe('52');
      expect(store.state.hashMarkOffsetsY).toEqual([32, 52]);
      backHashOffsetY.setValue(56);
      expect(backHashOffsetYElement.value).toBe('56');
      return Vue.nextTick().then(() => {
        expect(store.state.hashMarkOffsetsY).toEqual([32, 56]);
      });
    });

    it('setting: middleOfField', async () => {
      const middleOfField = wrapper.find('[name="middleOfField"]');
      expect(middleOfField.exists()).toBeTruthy();
      const middleOfFieldElement = <HTMLInputElement>(middleOfField.element);
      expect(middleOfFieldElement.value).toBe('50');
      expect(store.state.middleOfField).toEqual(50);
      middleOfField.setValue(40);
      expect(middleOfFieldElement.value).toBe('40');
      return Vue.nextTick().then(() => {
        expect(store.state.middleOfField).toEqual(40);
      });
    });
  });
});
