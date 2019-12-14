import { Wrapper, createLocalVue, mount } from '@vue/test-utils';
import Vue, { VueConstructor } from 'vue';
import Vuex, { Store } from 'vuex';
import Grapher from '@/components/grapher/Grapher.vue';
import { CalChartState, generateStore } from '@/store';
import Show from '@/models/Show';
import Field from '@/models/Field';
import svgPanZoom from 'svg-pan-zoom';
import StuntSheet from '@/models/StuntSheet';
import StuntSheetDot from '@/models/StuntSheetDot';

jest.mock('svg-pan-zoom', () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({}),
  };
});

describe('components/grapher/Grapher.vue', () => {
  let localVue: VueConstructor<Vue>;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });

  it('on mount, initialize grapherSvgPanZoom in store', () => {
    const store = generateStore({});
    expect(store.state.grapherSvgPanZoom).toBeUndefined();
    expect(svgPanZoom).not.toHaveBeenCalled();
    mount(Grapher, {
      store,
      localVue,
    });
    expect(svgPanZoom).toHaveBeenCalled();
    expect(store.state.grapherSvgPanZoom).not.toBeUndefined();
    expect(store.state.grapherSvgPanZoom);
  });

  describe('small field', () => {
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
      expect(wrapper.contains('[data-test="grapher--yard-line"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--yard-line"]'))
        .toHaveLength(1);
    });

    it('generates two hash marks', () => {
      expect(wrapper.contains('[data-test="grapher--hash-mark"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--hash-mark"]'))
        .toHaveLength(2);
    });

    it('field has width 32 and height 24', () => {
      expect(wrapper.contains('[data-test="grapher--field-rect"]'))
        .toBeTruthy();
      expect(wrapper.find('[data-test="grapher--field-rect"]')
        .attributes('width')).toBe('32');
      expect(wrapper.find('[data-test="grapher--field-rect"]')
        .attributes('height')).toBe('24');
    });

    it('four step grid: generates 6 vert lines and 5 horiz lines', () => {
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-vertical"]'))
        .toHaveLength(6);
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-horizontal"]'))
        .toHaveLength(5);
    });

    it('generates no field numbers', () => {
      expect(wrapper.contains('[data-test="grapher--yard-number"]'))
        .toBeFalsy();
    });

    it('does not render four step grid if fourStepGrid is false', () => {
      store.commit('setFourStepGrid', false);
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]'))
        .toBeFalsy();
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]'))
        .toBeFalsy();
    });

    it('replaces yardlines with gridlines if yardlines is false', () => {
      store.commit('setYardlines', false);
      expect(wrapper.contains('[data-test="grapher--yard-line"]')).toBeFalsy();
      store.commit('setFourStepGrid', true);
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-vertical"]'))
        .toHaveLength(7);
    });

    it('does not render yardline numbers if yardlineNumbers is false', () => {
      store.commit('setYardlineNumbers', false);
      expect(wrapper.contains('[data-test="grapher--yard-number"]'))
        .toBeFalsy();
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
      expect(wrapper.contains('[data-test="grapher--yard-line"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--yard-line"]'))
        .toHaveLength(21);
    });

    it('generates 42 hash marks', () => {
      expect(wrapper.contains('[data-test="grapher--hash-mark"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--hash-mark"]'))
        .toHaveLength(42);
    });

    it('field has width 192 and height 84', () => {
      expect(wrapper.contains('[data-test="grapher--field-rect"]'))
        .toBeTruthy();
      expect(wrapper.find('[data-test="grapher--field-rect"]')
        .attributes('width')).toBe('192');
      expect(wrapper.find('[data-test="grapher--field-rect"]')
        .attributes('height')).toBe('84');
    });

    it('four step grid: generates 26 vert lines and 20 horiz lines', () => {
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-vertical"]'))
        .toHaveLength(26);
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-horizontal"]'))
        .toHaveLength(20);
    });

    it('generates 18 field numbers', () => {
      expect(wrapper.contains('[data-test="grapher--yard-number"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--yard-number"]'))
        .toHaveLength(18);
    });

    it('does not render four step grid if fourStepGrid is false', () => {
      store.commit('setFourStepGrid', false);
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]'))
        .toBeFalsy();
      expect(wrapper.contains('[data-test="grapher--grid-horizontal"]'))
        .toBeFalsy();
    });

    it('does not render yardlines if yardlines is false', () => {
      store.commit('setYardlines', false);
      expect(wrapper.contains('[data-test="grapher--yard-line"]')).toBeFalsy();
    });

    it('replaces yardlines with gridlines if yardlines is false', () => {
      store.commit('setYardlines', false);
      expect(wrapper.contains('[data-test="grapher--yard-line"]')).toBeFalsy();
      store.commit('setFourStepGrid', true);
      expect(wrapper.contains('[data-test="grapher--grid-vertical"]'))
        .toBeTruthy();
      expect(wrapper.findAll('[data-test="grapher--grid-vertical"]'))
        .toHaveLength(47);
    });

    describe('stuntSheetDots', () => {
      it('does not render any dots if no dots exist', () => {
        expect(wrapper.contains('[data-test="grapher--dot"]')).toBeFalsy();
      });

      const generateShowWithDots = (numDots: number): void => {
        const stuntSheetDots = [];
        for (let i = 0; i < numDots; i++) {
          stuntSheetDots.push(new StuntSheetDot({
            x: i * 2,
            y: i * 2,
          }));
        }
        store = generateStore({
          show: new Show({
            stuntSheets: [new StuntSheet({ stuntSheetDots })],
          }),
        });
        wrapper = mount(Grapher, {
          store,
          localVue,
        });
      };

      it('renders 1 dot if exists', () => {
        generateShowWithDots(1);
        expect(wrapper.contains('[data-test="grapher--dot"]')).toBeTruthy();
        expect(wrapper.findAll('[data-test="grapher--dot"]')).toHaveLength(1);
      });

      it('renders 2 dots if exists', () => {
        generateShowWithDots(2);
        expect(wrapper.contains('[data-test="grapher--dot"]')).toBeTruthy();
        expect(wrapper.findAll('[data-test="grapher--dot"]')).toHaveLength(2);
      });
    });
  });
});
