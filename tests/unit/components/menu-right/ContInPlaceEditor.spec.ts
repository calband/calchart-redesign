import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import ContInPlaceEditor from "@/components/menu-right/ContInPlaceEditor.vue";
import StuntSheet from "@/models/StuntSheet";
import Show from "@/models/Show";
import ContInPlace from "@/models/continuity/ContInPlace";
import { DIRECTIONS, MARCH_TYPES } from "@/models/util/constants";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import { Mutations } from "@/store/mutations";

describe("components/menu-right/ContInPlaceEditor", () => {
  let editor: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let commitSpy: jest.SpyInstance;
  const stuntSheets = [
    new StuntSheet({
      beats: 4,
      title: "a",
      dotTypes: [
        [new ContETFDynamic(), new ContInPlace(), new ContInPlace()],
        [new ContInPlace()],
      ],
    }),
    new StuntSheet({ beats: 8, title: "b" }),
  ];
  const show = new Show({ stuntSheets });

  describe("continuityIndex = 1, dotTypeIndex = 0", () => {
    beforeEach(() => {
      // Mock out store and mount
      const localVue = createLocalVue();
      localVue.use(Vuex);
      localVue.use(Buefy);
      store = generateStore({ show });
      commitSpy = jest.spyOn(store, "commit");
      editor = mount(ContInPlaceEditor, {
        store,
        localVue,
        propsData: {
          continuityIndex: 1,
          dotTypeIndex: 0,
        },
      });
    });

    it("changing march type", () => {
      const selectMarchType = editor.find(
        '[data-test="cont-in-place--march-type"]'
      );
      expect(selectMarchType.exists()).toBe(true);
      const selectMarchTypeElement = selectMarchType.element as HTMLSelectElement;
      expect(selectMarchTypeElement.value).toBe(MARCH_TYPES.HS);
      expect(commitSpy).not.toHaveBeenCalled();
      selectMarchType.setValue(MARCH_TYPES.MINI_MILITARY);
      expect(commitSpy).toHaveBeenCalledWith(
        Mutations.UPDATE_DOT_TYPE_CONTINUITY,
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].continuity.marchType).toBe(
        MARCH_TYPES.MINI_MILITARY
      );
    });

    it("changing duration", () => {
      const durationInput = editor.find(
        '[data-test="cont-in-place--duration"]'
      );
      expect(durationInput.exists()).toBe(true);
      const durationInputElement = durationInput.element as HTMLInputElement;
      expect(durationInputElement.value).toBe("0");
      expect(commitSpy).not.toHaveBeenCalled();
      durationInput.setValue("8");
      expect(commitSpy).toHaveBeenCalledWith(
        Mutations.UPDATE_DOT_TYPE_CONTINUITY,
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].continuity.duration).toBe(8);
    });

    it("changing direction", () => {
      const selectDirection = editor.find(
        '[data-test="cont-in-place--direction"]'
      );
      expect(selectDirection.exists()).toBe(true);
      const selectDirectionElement = selectDirection.element as HTMLSelectElement;
      expect(selectDirectionElement.value).toBe(`${DIRECTIONS.E}`);
      expect(commitSpy).not.toHaveBeenCalled();
      selectDirection.setValue(`${DIRECTIONS.S}`);
      expect(commitSpy).toHaveBeenCalledWith(
        Mutations.UPDATE_DOT_TYPE_CONTINUITY,
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].continuity.direction).toBe(
        DIRECTIONS.S
      );
    });

    it("can delete if more than one continuity exists for the dot type", async () => {
      const deleteButton = editor.find('[data-test="cont-in-place--delete"]');
      expect(deleteButton.exists()).toBe(true);
      expect(commitSpy).not.toHaveBeenCalled();
      deleteButton.trigger("click");
      await editor.vm.$nextTick();
      expect(commitSpy).toHaveBeenCalledWith(
        Mutations.DELETE_DOT_TYPE_CONTINUITY,
        {
          dotTypeIndex: 0,
          continuityIndex: 1,
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
      editor = mount(ContInPlaceEditor, {
        store,
        localVue,
        propsData: {
          continuityIndex: 0,
          dotTypeIndex: 1,
        },
      });
    });

    it("can't delete if only one continuity exists for the dot type", async () => {
      const deleteButton = editor.find('[data-test="cont-in-place--delete"]');
      expect(deleteButton.exists()).toBe(false);
    });
  });
});
