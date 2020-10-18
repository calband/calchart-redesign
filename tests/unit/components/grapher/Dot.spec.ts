import { Wrapper, createLocalVue, mount } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import Grapher from "@/components/grapher/Grapher.vue";
import Dot from "@/components/grapher/Dot.vue";
import { CalChartState, generateStore } from "@/store";
import Show from "@/models/Show";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import DotAppearance from "@/models/DotAppearance";

jest.mock("svg-pan-zoom", () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({ resize: jest.fn() }),
  };
});

describe("components/grapher/Dot.vue", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<CalChartState>;
  let wrapper: Wrapper<Vue>;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });
  describe("stuntSheetDot", () => {
    it("renders the basic dot", () => {
      const stuntSheetDots = [];
      stuntSheetDots.push(
        new StuntSheetDot({
          x: 10,
          y: 10,
          dotTypeIndex: 0,
        })
      );
      store = generateStore({
        show: new Show({
          stuntSheets: [new StuntSheet({ stuntSheetDots })],
        }),
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
      expect(wrapper.findComponent(Dot).props("dotTypeIndex")).toBe(0);
      expect(wrapper.find('[data-test="dot--circle"]').exists()).toBeTruthy();
      expect(wrapper.find('[data-test="dot--circle"]').attributes("fill")).toBe(
        "black"
      );
      expect(
        wrapper.find('[data-test="dot--circle"]').attributes("fill-opacity")
      ).toBe("1");
      expect(
        wrapper.find('[data-test="dot--circle"]').attributes("stroke")
      ).toBe("black");
      expect(wrapper.find('[data-test="dot--fslash"]').exists()).toBeFalsy();
      expect(wrapper.find('[data-test="dot--bslash"]').exists()).toBeFalsy();
    });
    it("renders a modified dot", () => {
      const stuntSheetDots = [];
      stuntSheetDots.push(
        new StuntSheetDot({
          x: 10,
          y: 10,
          dotTypeIndex: 0,
        })
      );
      const dotAppearances = [];
      dotAppearances.push(
        new DotAppearance({
          filled: false,
          fill: "red",
          color: "blue",
          fwSlash: true,
          bwSlash: true,
        })
      );
      store = generateStore({
        show: new Show({
          stuntSheets: [
            new StuntSheet({
              stuntSheetDots: stuntSheetDots,
              dotAppearances: dotAppearances,
            }),
          ],
        }),
      });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
      expect(wrapper.findComponent(Dot).props("dotTypeIndex")).toBe(0);
      expect(wrapper.find('[data-test="dot--circle"]').exists()).toBeTruthy();
      expect(wrapper.find('[data-test="dot--circle"]').attributes("fill")).toBe(
        "red"
      );
      expect(
        wrapper.find('[data-test="dot--circle"]').attributes("fill-opacity")
      ).toBe("0");
      expect(
        wrapper.find('[data-test="dot--circle"]').attributes("stroke")
      ).toBe("blue");
      expect(wrapper.find('[data-test="dot--fslash"]').exists()).toBeTruthy();
      expect(wrapper.find('[data-test="dot--bslash"]').exists()).toBeTruthy();
    });
  });
});
