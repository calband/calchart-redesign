import { Wrapper, createLocalVue, mount } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import Grapher from "@/components/grapher/Grapher.vue";
import { CalChartState, generateStore } from "@/store";
import Show from "@/models/Show";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";

jest.mock("svg-pan-zoom", () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({ resize: jest.fn() }),
  };
});

describe("components/grapher/GrapherDots.vue", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<CalChartState>;
  let wrapper: Wrapper<Vue>;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });

  describe("stuntSheetDots", () => {
    const generateShowWithDots = (
      numDots: number,
      numToolDots: number
    ): void => {
      const stuntSheetDots = [];
      for (let i = 0; i < numDots; i++) {
        stuntSheetDots.push(
          new StuntSheetDot({
            x: i * 2,
            y: i * 2,
          })
        );
      }

      const grapherToolDots = [];
      for (let j = 0; j < numToolDots; j++) {
        grapherToolDots.push(
          new StuntSheetDot({
            x: j * 2 + 2,
            y: j * 2 + 2,
          })
        );
      }

      store = generateStore({
        show: new Show({
          stuntSheets: [new StuntSheet({ stuntSheetDots })],
        }),
        grapherToolDots,
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    };

    it.each([
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ])("renders %i dots and %i tool dots", (numDots, numToolDots) => {
      generateShowWithDots(numDots, numToolDots);
      expect(wrapper.findAll('[data-test="grapher-dots--dot"]')).toHaveLength(
        numDots
      );
      expect(wrapper.findAll('[data-test="dot--dottext"]')).toHaveLength(
        numDots
      );
      expect(wrapper.findAll('[data-test="grapher-tool--dot"]')).toHaveLength(
        numToolDots
      );
    });
  });
});
