import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex from 'vuex';
import svgPanZoom from 'svg-pan-zoom';
import Grapher from '@/components/grapher/Grapher.vue';

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
    let store;
    let wrapper: Wrapper<Vue>;
    beforeAll(() => {
      store = new Vuex.Store({
        state: {
          hashMarkOffsetsY: [8, 16],
          middleOfField: 0,
          enableFourStepGrid: true,
        },
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it('generates one yard line', () => {
      expect(wrapper.findAll('.grapher--yard-line').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--yard-line')).toHaveLength(1);
    });

    it('generates two hash marks', () => {
      expect(wrapper.findAll('.grapher--hash-mark').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--hash-mark')).toHaveLength(2);
    });

    it('field has width 32 and height 24', () => {
      expect(wrapper.find('.grapher--field-rect').exists()).toBeTruthy();
      expect(wrapper.find('.grapher--field-rect').attributes('width')).toBe('32');
      expect(wrapper.find('.grapher--field-rect').attributes('height')).toBe('24');
    });

    it('four step grid: generates 6 vertical lines and 5 horizontal lines', () => {
      expect(wrapper.findAll('.grapher--grid-vertical').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-vertical')).toHaveLength(6);
      expect(wrapper.findAll('.grapher--grid-horizontal').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-horizontal')).toHaveLength(5);
    });

    it('generates no field numbers', () => {
      expect(wrapper.findAll('.grapher--yard-number').exists()).toBeFalsy();
    });

    it('does not render four step grid if enableFourStepGrid is false', () => {
      store = new Vuex.Store({
        state: {
          hashMarkOffsetsY: [8, 16],
          middleOfField: 0,
          enableFourStepGrid: false,
        },
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
      expect(wrapper.findAll('.grapher--grid-vertical').exists()).toBeFalsy();
      expect(wrapper.findAll('.grapher--grid-horizontal').exists()).toBeFalsy();
    });
  });

  describe('college field (middleOfField is 50 and hashMarkOffsetsY is [32, 52]', () => {
    let store;
    let wrapper: Wrapper<Vue>;
    beforeAll(() => {
      store = new Vuex.Store({
        state: {
          hashMarkOffsetsY: [32, 52],
          middleOfField: 50,
          enableFourStepGrid: true,
        },
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it('generates 21 yard lines', () => {
      expect(wrapper.findAll('.grapher--yard-line').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--yard-line')).toHaveLength(21);
    });

    it('generates 42 hash marks', () => {
      expect(wrapper.findAll('.grapher--hash-mark').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--hash-mark')).toHaveLength(42);
    });

    it('field has width 192 and height 84', () => {
      expect(wrapper.find('.grapher--field-rect').exists()).toBeTruthy();
      expect(wrapper.find('.grapher--field-rect').attributes('width')).toBe('192');
      expect(wrapper.find('.grapher--field-rect').attributes('height')).toBe('84');
    });

    it('four step grid: generates 26 vertical lines and 20 horizontal lines', () => {
      expect(wrapper.findAll('.grapher--grid-vertical').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-vertical')).toHaveLength(26);
      expect(wrapper.findAll('.grapher--grid-horizontal').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--grid-horizontal')).toHaveLength(20);
    });

    it('generates 18 field numbers', () => {
      expect(wrapper.findAll('.grapher--yard-number').exists()).toBeTruthy();
      expect(wrapper.findAll('.grapher--yard-number')).toHaveLength(18);
    });

    it('does not render four step grid if enableFourStepGrid is false', () => {
      store = new Vuex.Store({
        state: {
          hashMarkOffsetsY: [32, 54],
          middleOfField: 50,
          enableFourStepGrid: false,
        },
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
      expect(wrapper.findAll('.grapher--grid-vertical').exists()).toBeFalsy();
      expect(wrapper.findAll('.grapher--grid-horizontal').exists()).toBeFalsy();
    });
  });
});
