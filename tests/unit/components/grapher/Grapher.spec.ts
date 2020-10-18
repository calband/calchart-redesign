import { Wrapper, createLocalVue, mount } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import Grapher from "@/components/grapher/Grapher.vue";
import { CalChartState, generateStore } from "@/store";
import Show from "@/models/Show";
import Field from "@/models/Field";
import svgPanZoom from "svg-pan-zoom";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import BaseTool from "@/tools/BaseTool";

jest.mock("svg-pan-zoom", () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({ resize: jest.fn() }),
  };
});

describe("components/grapher/Grapher.vue", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<CalChartState>;
  let wrapper: Wrapper<Vue>;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
  });

  it("on mount, initialize grapherSvgPanZoom in store", () => {
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

  describe("small field", () => {
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

    it("generates one yard line", () => {
      expect(wrapper.findAll('[data-test="grapher--yard-line"]')).toHaveLength(
        1
      );
    });

    it("generates two hash marks", () => {
      expect(wrapper.findAll('[data-test="grapher--hash-mark"]')).toHaveLength(
        2
      );
    });

    it("field has width 32 and height 24", () => {
      const rect = wrapper.find('[data-test="grapher--field-rect"]');
      expect(rect.exists()).toBeTruthy();
      expect(rect.attributes("width")).toBe("32");
      expect(rect.attributes("height")).toBe("24");
    });

    it("four step grid: generates 6 vert lines and 5 horiz lines", () => {
      expect(
        wrapper.findAll('[data-test="grapher--grid-vertical"]')
      ).toHaveLength(6);
      expect(
        wrapper.findAll('[data-test="grapher--grid-horizontal"]')
      ).toHaveLength(5);
    });

    it("generates no field numbers", () => {
      expect(
        wrapper.find('[data-test="grapher--yard-number"]').exists()
      ).toBeFalsy();
    });

    it("does not render four step grid if fourStepGrid is false", async () => {
      store.commit("setFourStepGrid", false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher--grid-vertical"]').exists()
      ).toBeFalsy();
      expect(
        wrapper.find('[data-test="grapher--grid-horizontal"]').exists()
      ).toBeFalsy();
    });

    it("replaces yardlines with gridlines if yardlines is false", async () => {
      store.commit("setYardlines", false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher--yard-line"]').exists()
      ).toBeFalsy();

      store.commit("setFourStepGrid", true);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.findAll('[data-test="grapher--grid-vertical"]')
      ).toHaveLength(7);
    });

    it("if yardlineNumbers is false, do not render", async () => {
      store.commit("setYardlineNumbers", false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher--yard-number"]').exists()
      ).toBeFalsy();
    });

    it("if showDotLabels is false, do not render", async () => {
      store.commit("setShowDotLabels", false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher--dottext"]').exists()
      ).toBeFalsy();
    });
  });

  describe("default field (college field)", () => {
    beforeAll(() => {
      store = generateStore();
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it("generates 21 yard lines", () => {
      expect(wrapper.findAll('[data-test="grapher--yard-line"]')).toHaveLength(
        21
      );
    });

    it("generates 42 hash marks", () => {
      expect(wrapper.findAll('[data-test="grapher--hash-mark"]')).toHaveLength(
        42
      );
    });

    it("field has width 192 and height 84", () => {
      expect(
        wrapper.find('[data-test="grapher--field-rect"]').attributes("width")
      ).toBe("192");
      expect(
        wrapper.find('[data-test="grapher--field-rect"]').attributes("height")
      ).toBe("84");
    });

    it("four step grid: generates 26 vert lines and 20 horiz lines", () => {
      expect(
        wrapper.findAll('[data-test="grapher--grid-vertical"]')
      ).toHaveLength(26);
      expect(
        wrapper.findAll('[data-test="grapher--grid-horizontal"]')
      ).toHaveLength(20);
    });

    it("generates 18 field numbers", () => {
      expect(
        wrapper.findAll('[data-test="grapher--yard-number"]')
      ).toHaveLength(18);
    });

    it("does not render four step grid if fourStepGrid is false", async () => {
      store.commit("setFourStepGrid", false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher--grid-vertical"]').exists()
      ).toBeFalsy();
      expect(
        wrapper.find('[data-test="grapher--grid-horizontal"]').exists()
      ).toBeFalsy();
    });

    it("does not render yardlines if yardlines is false", async () => {
      store.commit("setYardlines", false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher--yard-line"]').exists()
      ).toBeFalsy();
    });

    it("replaces yardlines with gridlines if yardlines is false", async () => {
      store.commit("setYardlines", false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher--yard-line"]').exists()
      ).toBeFalsy();

      store.commit("setFourStepGrid", true);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.findAll('[data-test="grapher--grid-vertical"]')
      ).toHaveLength(47);
    });
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
      expect(wrapper.findAll('[data-test="grapher--dot"]')).toHaveLength(
        numDots
      );
      expect(wrapper.findAll('[data-test="grapher--dottext"]')).toHaveLength(
        numDots
      );
      expect(wrapper.findAll('[data-test="grapher--tool-dot"]')).toHaveLength(
        numToolDots
      );
    });
  });

  describe("event listners", () => {
    let mockTool: BaseTool;

    beforeEach(() => {
      mockTool = {
        onClick: jest.fn(),
        onMousemove: jest.fn(),
      };
      store = generateStore({ toolSelected: mockTool });
      wrapper = mount(Grapher, {
        store,
        localVue,
      });
    });

    it("window.resize", () => {
      window.dispatchEvent(new UIEvent("resize"));
      const grapherSvgPanZoom = store.state
        .grapherSvgPanZoom as SvgPanZoom.Instance;
      expect(grapherSvgPanZoom.resize).toHaveBeenCalled();
    });

    it("click", () => {
      expect(mockTool.onClick).not.toHaveBeenCalled();
      wrapper.find('[data-test="grapher--svg"]').trigger("click");
      expect(mockTool.onClick).toHaveBeenCalled();
    });

    it("mousemove", () => {
      expect(mockTool.onMousemove).not.toHaveBeenCalled();
      wrapper.find('[data-test="grapher--svg"]').trigger("mousemove");
      expect(mockTool.onMousemove).toHaveBeenCalled();
    });
  });
});
