import { Wrapper, createLocalVue, mount } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import Grapher from "@/components/grapher/Grapher.vue";
import { CalChartState, generateStore } from "@/store";
import Show from "@/models/Show";
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

  describe("event listners", () => {
    let mockTool: BaseTool;

    beforeEach(() => {
      mockTool = {
        onMouseDown: jest.fn(),
        onMouseUp: jest.fn(),
        onMouseMove: jest.fn(),
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
      expect(mockTool.onMouseDown).not.toHaveBeenCalled();
      wrapper.find('[data-test="grapher--svg"]').trigger("mousedown");
      expect(mockTool.onMouseDown).toHaveBeenCalled();
    });

    it("mousemove", () => {
      expect(mockTool.onMouseMove).not.toHaveBeenCalled();
      wrapper.find('[data-test="grapher--svg"]').trigger("mousemove");
      expect(mockTool.onMouseMove).toHaveBeenCalled();
    });
  });
});
