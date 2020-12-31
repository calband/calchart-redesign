import { Wrapper, createLocalVue, mount } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import Grapher from "@/components/grapher/Grapher.vue";
import { CalChartState, generateStore } from "@/store";
import Show from "@/models/Show";
import Field from "@/models/Field";
import { SET_FOUR_STEP_GRID, SET_SHOW_DOT_LABELS, SET_YARDLINES, SET_YARDLINE_NUMBERS } from "@/store/mutations";

jest.mock("svg-pan-zoom", () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({ resize: jest.fn() }),
  };
});

describe("components/grapher/GrapherField.vue", () => {
  let localVue: VueConstructor<Vue>;
  let store: Store<CalChartState>;
  let wrapper: Wrapper<Vue>;
  beforeAll(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
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
      expect(
        wrapper.findAll('[data-test="grapher-field--yard-line"]')
      ).toHaveLength(1);
    });

    it("generates two hash marks", () => {
      expect(
        wrapper.findAll('[data-test="grapher-field--hash-mark"]')
      ).toHaveLength(2);
    });

    it("field has width 32 and height 24", () => {
      const rect = wrapper.find('[data-test="grapher-field--rect"]');
      expect(rect.exists()).toBeTruthy();
      expect(rect.attributes("width")).toBe("32");
      expect(rect.attributes("height")).toBe("24");
    });

    it("four step grid: generates 6 vert lines and 5 horiz lines", () => {
      expect(
        wrapper.findAll('[data-test="grapher-field--grid-vertical"]')
      ).toHaveLength(6);
      expect(
        wrapper.findAll('[data-test="grapher-field--grid-horizontal"]')
      ).toHaveLength(5);
    });

    it("generates no field numbers", () => {
      expect(
        wrapper.find('[data-test="grapher-field--yard-number"]').exists()
      ).toBeFalsy();
    });

    it("does not render four step grid if fourStepGrid is false", async () => {
      store.commit(SET_FOUR_STEP_GRID, false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher-field--grid-vertical"]').exists()
      ).toBeFalsy();
      expect(
        wrapper.find('[data-test="grapher-field--grid-horizontal"]').exists()
      ).toBeFalsy();
    });

    it("replaces yardlines with gridlines if yardlines is false", async () => {
      store.commit(SET_YARDLINES, false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher-field--yard-line"]').exists()
      ).toBeFalsy();

      store.commit(SET_FOUR_STEP_GRID, true);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.findAll('[data-test="grapher-field--grid-vertical"]')
      ).toHaveLength(7);
    });

    it("if yardlineNumbers is false, do not render", async () => {
      store.commit(SET_YARDLINE_NUMBERS, false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher-field--yard-number"]').exists()
      ).toBeFalsy();
    });

    it("if showDotLabels is false, do not render", async () => {
      store.commit(SET_SHOW_DOT_LABELS, false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher-dots--dottext"]').exists()
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
      expect(
        wrapper.findAll('[data-test="grapher-field--yard-line"]')
      ).toHaveLength(21);
    });

    it("generates 42 hash marks", () => {
      expect(
        wrapper.findAll('[data-test="grapher-field--hash-mark"]')
      ).toHaveLength(42);
    });

    it("field has width 192 and height 84", () => {
      expect(
        wrapper.find('[data-test="grapher-field--rect"]').attributes("width")
      ).toBe("192");
      expect(
        wrapper.find('[data-test="grapher-field--rect"]').attributes("height")
      ).toBe("84");
    });

    it("four step grid: generates 26 vert lines and 20 horiz lines", () => {
      expect(
        wrapper.findAll('[data-test="grapher-field--grid-vertical"]')
      ).toHaveLength(26);
      expect(
        wrapper.findAll('[data-test="grapher-field--grid-horizontal"]')
      ).toHaveLength(20);
    });

    it("generates 18 field numbers", () => {
      expect(
        wrapper.findAll('[data-test="grapher-field--yard-number"]')
      ).toHaveLength(18);
    });

    it("does not render four step grid if fourStepGrid is false", async () => {
      store.commit(SET_FOUR_STEP_GRID, false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher-field--grid-vertical"]').exists()
      ).toBeFalsy();
      expect(
        wrapper.find('[data-test="grapher-field--grid-horizontal"]').exists()
      ).toBeFalsy();
    });

    it("does not render yardlines if yardlines is false", async () => {
      store.commit(SET_YARDLINES, false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher-field--yard-line"]').exists()
      ).toBeFalsy();
    });

    it("replaces yardlines with gridlines if yardlines is false", async () => {
      store.commit(SET_YARDLINES, false);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="grapher-field--yard-line"]').exists()
      ).toBeFalsy();

      store.commit(SET_FOUR_STEP_GRID, true);
      await wrapper.vm.$nextTick();

      expect(
        wrapper.findAll('[data-test="grapher-field--grid-vertical"]')
      ).toHaveLength(47);
    });
  });
});
