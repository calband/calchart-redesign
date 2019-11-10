import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import svgPanZoom from 'svg-pan-zoom';
import Grapher from '@/components/grapher/Grapher.vue';
import { initialState, stateType, mutations } from '@/store';

// Mock out svgPanZoom to avoid TypeError: (0 , _svgPanZoom.default) is not a function
// https://github.com/facebook/jest/issues/5023#issuecomment-497120576
jest.mock('svg-pan-zoom', () => jest.fn(() => {}));

describe('components/grapher/Grapher.vue', () => {
  let localVue: VueConstructor<Vue>;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });

  describe('small field (middleOfField is 0 and hashMarkOffsetsY is [8, 16]', () => {
    let store: Store<stateType>;
    let wrapper: Wrapper<Vue>;
    beforeAll(() => {
      store = new Vuex.Store({
        state: initialState({
          hashMarkOffsetsY: [8, 16],
          middleOfField: 0
        }),
        mutations: mutations
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it('generates one yard line', () => {
      expect(wrapper.contains('.grapher--yard-line')).toBeTruthy();
      expect(wrapper.findAll('.grapher--yard-line')).toHaveLength(1);
    });

    it('generates two hash marks', () => {
      expect(wrapper.contains('.grapher--hash-mark')).toBeTruthy();
      expect(wrapper.findAll('.grapher--hash-mark')).toHaveLength(2);
    });

    it('field has width 32 and height 24', () => {
      expect(wrapper.contains('.grapher--field-rect')).toBeTruthy();
      expect(wrapper.find('.grapher--field-rect').attributes('width')).toBe('32');
      expect(wrapper.find('.grapher--field-rect').attributes('height')).toBe('24');
    });

    it('four step grid: generates 6 vertical lines and 5 horizontal lines', () => {
      expect(wrapper.contains('.grapher--grid-vertical')).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-vertical')).toHaveLength(6);
      expect(wrapper.contains('.grapher--grid-horizontal')).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-horizontal')).toHaveLength(5);
    });

    it('generates no field numbers', () => {
      expect(wrapper.contains('.grapher--yard-number')).toBeFalsy();
    });

    it('does not render four step grid if fourStepGrid is false', () => {
      store.commit('setFourStepGrid', false);
      expect(wrapper.contains('.grapher--grid-vertical')).toBeFalsy();
      expect(wrapper.contains('.grapher--grid-horizontal')).toBeFalsy();
    });
  });

  describe('default field (college field)', () => {
    let store: Store<stateType>;
    let wrapper: Wrapper<Vue>;
    beforeAll(() => {
      store = new Vuex.Store({
        state: initialState(),
        mutations: mutations
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it('generates 21 yard lines', () => {
      expect(wrapper.contains('.grapher--yard-line')).toBeTruthy();
      expect(wrapper.findAll('.grapher--yard-line')).toHaveLength(21);
    });

    it('generates 42 hash marks', () => {
      expect(wrapper.contains('.grapher--hash-mark')).toBeTruthy();
      expect(wrapper.findAll('.grapher--hash-mark')).toHaveLength(42);
    });

    it('field has width 192 and height 84', () => {
      expect(wrapper.contains('.grapher--field-rect')).toBeTruthy();
      expect(wrapper.find('.grapher--field-rect').attributes('width')).toBe('192');
      expect(wrapper.find('.grapher--field-rect').attributes('height')).toBe('84');
    });

    it('four step grid: generates 26 vertical lines and 20 horizontal lines', () => {
      expect(wrapper.contains('.grapher--grid-vertical')).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-vertical')).toHaveLength(26);
      expect(wrapper.contains('.grapher--grid-horizontal')).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-horizontal')).toHaveLength(20);
    });

    it('generates 18 field numbers', () => {
      expect(wrapper.contains('.grapher--yard-number')).toBeTruthy();
      expect(wrapper.findAll('.grapher--yard-number')).toHaveLength(18);
    });

    it('does not render four step grid if fourStepGrid is false', () => {
      store.commit('setFourStepGrid', false);
      expect(wrapper.contains('.grapher--grid-vertical')).toBeFalsy();
      expect(wrapper.contains('.grapher--grid-horizontal')).toBeFalsy();
    });
  });
});
