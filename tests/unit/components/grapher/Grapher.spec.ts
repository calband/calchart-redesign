import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import svgPanZoom from 'svg-pan-zoom';
import Grapher from '@/components/grapher/Grapher.vue';
import { generateStore, CalChartState } from '@/store';
import Show from '@/models/Show';
import Field from '@/models/Field';

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
    let store: Store<CalChartState>;
    let wrapper: Wrapper<Vue>;
    beforeAll(() => {
      const field: Field = new Field({
        frontHashOffsetY: 8,
        backHashOffsetY: 16,
        middleOfField: 0,
      });
      const show: Show = new Show({ field });
      store = generateStore({ show });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it('generates one yard line', () => {
      expect(wrapper.contains('[data-test="grapher--yard-line"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--yard-line"]')).toHaveLength(1);
    });

    it('generates two hash marks', () => {
      expect(wrapper.contains('[data-test="grapher--hash-mark"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--hash-mark"]')).toHaveLength(2);
    });

    it('field has width 32 and height 24', () => {
      expect(wrapper.contains('.grapher--field-rect')).toBeTruthy();
      expect(wrapper.find('.grapher--field-rect').attributes('width')).toBe('32');
      expect(wrapper.find('.grapher--field-rect').attributes('height')).toBe('24');
    });

    it('four step grid: generates 6 vertical lines and 5 horizontal lines', () => {
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-vertical"]')).toHaveLength(6);
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-horizontal"]')).toHaveLength(5);
    });

    it('generates no field numbers', () => {
      expect(wrapper.contains('[data-test="grapher--yard-number"]')).toBeFalsy();
    });

    it('does not render four step grid if fourStepGrid is false', () => {
      store.commit('setFourStepGrid', false);
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]')).toBeFalsy();
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]')).toBeFalsy();
    });
  });

  describe('default field (college field)', () => {
    let store: Store<CalChartState>;
    let wrapper: Wrapper<Vue>;
    beforeAll(() => {
      store = generateStore();
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it('generates 21 yard lines', () => {
      expect(wrapper.contains('[data-test="grapher--yard-line"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--yard-line"]')).toHaveLength(21);
    });

    it('generates 42 hash marks', () => {
      expect(wrapper.contains('[data-test="grapher--hash-mark"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--hash-mark"]')).toHaveLength(42);
    });

    it('field has width 192 and height 84', () => {
      expect(wrapper.contains('.grapher--field-rect')).toBeTruthy();
      expect(wrapper.find('.grapher--field-rect').attributes('width')).toBe('192');
      expect(wrapper.find('.grapher--field-rect').attributes('height')).toBe('84');
    });

    it('four step grid: generates 26 vertical lines and 20 horizontal lines', () => {
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-vertical"]')).toHaveLength(26);
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-horizontal"]')).toHaveLength(20);
    });

    it('generates 18 field numbers', () => {
      expect(wrapper.contains('[data-test="grapher--yard-number"]')).toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--yard-number"]')).toHaveLength(18);
    });

    it('does not render four step grid if fourStepGrid is false', () => {
      store.commit('setFourStepGrid', false);
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]')).toBeFalsy();
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]')).toBeFalsy();
    });
  });
});
