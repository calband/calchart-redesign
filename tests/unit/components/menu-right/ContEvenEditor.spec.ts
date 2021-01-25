import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import ContEvenEditor from "@/components/menu-right/ContEvenEditor.vue";
import StuntSheet from "@/models/StuntSheet";
import Show from "@/models/Show";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContEven from "@/models/continuity/ContEven";
import { MARCH_TYPES } from "@/models/util/constants";
import { Mutations } from "@/store/mutations";

describe("components/menu-right/ContEvenEditor", () => {
  let editor: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let commitSpy: jest.SpyInstance;
  const stuntSheets = [
    new StuntSheet({
      beats: 4,
      title: "a",
      dotTypes: [[new ContEven(), new ContInPlace()], [new ContEven()]],
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
      editor = mount(ContEvenEditor, {
        store,
        localVue,
        propsData: {
          continuityIndex: 0,
          dotTypeIndex: 0,
        },
      });
    });

    it("changing march type", () => {
      const selectMarchType = editor.find(
        '[data-test="cont-even--march-type"]'
      );
      expect(selectMarchType.exists()).toBe(true);
      const selectMarchTypeElement = selectMarchType.element as HTMLSelectElement;
      expect(selectMarchTypeElement.value).toBe(MARCH_TYPES.MINI_MILITARY);
      expect(commitSpy).not.toHaveBeenCalled();
      selectMarchType.setValue(MARCH_TYPES.HS);
      expect(commitSpy).toHaveBeenCalledWith(
        Mutations.UPDATE_DOT_TYPE_MARCH_STYLE,
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].marchType).toBe(MARCH_TYPES.HS);
    });

    it("can delete if more than one continuity exists for the dot type", async () => {
      const deleteButton = editor.find('[data-test="cont-even--delete"]');
      expect(deleteButton.exists()).toBe(true);
      expect(commitSpy).not.toHaveBeenCalled();
      deleteButton.trigger("click");
      await editor.vm.$nextTick();
      expect(commitSpy).toHaveBeenCalledWith(
        Mutations.DELETE_DOT_TYPE_CONTINUITY,
        {
          dotTypeIndex: 0,
          continuityIndex: 0,
        }
      );
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
      editor = mount(ContEvenEditor, {
        store,
        localVue,
        propsData: {
          continuityIndex: 0,
          dotTypeIndex: 1,
        },
      });
    });

    it("can't delete if only one continuity exists for the dot type", async () => {
      const deleteButton = editor.find('[data-test="cont-even--delete"]');
      expect(deleteButton.exists()).toBe(false);
    });
  });
});
