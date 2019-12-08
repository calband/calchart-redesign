import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import Buefy from 'buefy';
import { generateStore } from '@/store';
import { stateType } from '@/store/types';
import FileModal from '@/components/menu-top/FileModal.vue';

describe('components/menu-top/FileModal', () => {
  let localVue: VueConstructor<Vue>;
  let wrapper: Wrapper<Vue>;
  let store: Store<stateType>;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = generateStore({});
    wrapper = mount(FileModal, {
      store,
      localVue,
    });
  });

  it('setting: frontHashOffsetY', async () => {
    const frontHashOffsetY = wrapper.find('[data-test="file-modal--front-hash-offset-y"]');
    expect(frontHashOffsetY.exists()).toBeTruthy();
    const frontHashOffsetYElement = <HTMLInputElement>(frontHashOffsetY.element);
    expect(frontHashOffsetYElement.value).toBe('32');
    expect(store.getters.getFrontHashOffsetY).toEqual(32);
    frontHashOffsetY.setValue(28);
    expect(frontHashOffsetYElement.value).toBe('28');
    return Vue.nextTick().then(() => {
      expect(store.getters.getFrontHashOffsetY).toEqual(28);
    });
  });

  it('setting: backHashOffsetY', async () => {
    const backHashOffsetY = wrapper.find('[data-test="file-modal--back-hash-offset-y"]');
    expect(backHashOffsetY.exists()).toBeTruthy();
    const backHashOffsetYElement = <HTMLInputElement>(backHashOffsetY.element);
    expect(backHashOffsetYElement.value).toBe('52');
    expect(store.getters.getBackHashOffsetY).toEqual(52);
    backHashOffsetY.setValue(56);
    expect(backHashOffsetYElement.value).toBe('56');
    return Vue.nextTick().then(() => {
      expect(store.getters.getBackHashOffsetY).toEqual(56);
    });
  });

  it('setting: middleOfField', async () => {
    const middleOfField = wrapper.find('[data-test="file-modal--middle-of-field"]');
    expect(middleOfField.exists()).toBeTruthy();
    const middleOfFieldElement = <HTMLInputElement>(middleOfField.element);
    expect(middleOfFieldElement.value).toBe('50');
    expect(store.getters.getMiddleOfField).toEqual(50);
    middleOfField.setValue(40);
    expect(middleOfFieldElement.value).toBe('40');
    return Vue.nextTick().then(() => {
      expect(store.getters.getMiddleOfField).toEqual(40);
    });
  });
});
