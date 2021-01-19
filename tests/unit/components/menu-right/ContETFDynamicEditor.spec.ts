import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import ContETFDynamicEditor from "@/components/menu-right/ContETFDynamicEditor.vue";
import StuntSheet from "@/models/StuntSheet";
import Show from "@/models/Show";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContETFDynamic, {
  ETF_DYNAMIC_TYPES,
} from "@/models/continuity/ContETFDynamic";
import { MARCH_TYPES } from "@/models/util/constants";

describe("components/menu-right/ContETFDynamicEditor", () => {
  let editor: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let commitSpy: jest.SpyInstance;
  const stuntSheets = [
    new StuntSheet({
      beats: 4,
      title: "a",
      dotTypes: [
        [new ContETFDynamic(), new ContInPlace()],
        [new ContETFDynamic()],
      ],
    }),
    new StuntSheet({ beats: 8, title: "b" }),
  ];
  const show = new Show({ stuntSheets });

  describe("continuityIndex = 0, dotTypeIndex = 0", () => {
    beforeEach(() => {
      // Mock out store and mount
      const localVue = createLocalVue();
      localVue.use(Vuex);
      localVue.use(Buefy);
      store = generateStore({ show });
      commitSpy = jest.spyOn(store, "commit");
      editor = mount(ContETFDynamicEditor, {
        store,
        localVue,
        propsData: {
          continuityIndex: 0,
          dotTypeIndex: 0,
        },
      });
    });

    it("changing eight to five type", () => {
      const selectETFType = editor.find(
        '[data-test="cont-etf-dynamic--etf-type"]'
      );
      expect(selectETFType.exists()).toBe(true);
      const selectETFTypeElement = selectETFType.element as HTMLSelectElement;
      expect(selectETFTypeElement.value).toBe(ETF_DYNAMIC_TYPES.EWNS);
      expect(commitSpy).not.toHaveBeenCalled();
      selectETFType.setValue(ETF_DYNAMIC_TYPES.NSEW);
      expect(commitSpy).toHaveBeenCalledWith(
        "updateDotTypeContinuity",
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].continuity.eightToFiveType).toBe(
        ETF_DYNAMIC_TYPES.NSEW
      );
    });

    it("changing march type", () => {
      const selectMarchType = editor.find(
        '[data-test="cont-etf-dynamic--march-type"]'
      );
      expect(selectMarchType.exists()).toBe(true);
      const selectMarchTypeElement = selectMarchType.element as HTMLSelectElement;
      expect(selectMarchTypeElement.value).toBe(MARCH_TYPES.HS);
      expect(commitSpy).not.toHaveBeenCalled();
      selectMarchType.setValue(MARCH_TYPES.MINI_MILITARY);
      expect(commitSpy).toHaveBeenCalledWith(
        "updateDotTypeContinuity",
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].continuity.marchType).toBe(
        MARCH_TYPES.MINI_MILITARY
      );
    });

    it("can delete if more than one continuity exists for the dot type", async () => {
      const deleteButton = editor.find(
        '[data-test="cont-etf-dynamic--delete"]'
      );
      expect(deleteButton.exists()).toBe(true);
      expect(commitSpy).not.toHaveBeenCalled();
      deleteButton.trigger("click");
      await editor.vm.$nextTick();
      expect(commitSpy).toHaveBeenCalledWith("deleteDotTypeContinuity", {
        dotTypeIndex: 0,
        continuityIndex: 0,
      });
    });
  });

  describe("continuityIndex = 0, dotTypeIndex = 1", () => {
    beforeEach(() => {
      // Mock out store and mount
      const localVue = createLocalVue();
      localVue.use(Vuex);
      localVue.use(Buefy);
      store = generateStore({ show });
      commitSpy = jest.spyOn(store, "commit");
      editor = mount(ContETFDynamicEditor, {
        store,
        localVue,
        propsData: {
          continuityIndex: 0,
          dotTypeIndex: 1,
        },
      });
    });

    it("can't delete if only one continuity exists for the dot type", async () => {
      const deleteButton = editor.find(
        '[data-test="cont-etf-dynamic--delete"]'
      );
      expect(deleteButton.exists()).toBe(false);
    });
  });
});
