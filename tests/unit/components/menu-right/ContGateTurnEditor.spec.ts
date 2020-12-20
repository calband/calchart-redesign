import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import ContGateTurnEditor from "@/components/menu-right/ContGateTurnEditor.vue";
import StuntSheet from "@/models/StuntSheet";
import Show from "@/models/Show";
import ContETFDynamic from "@/models/continuity/ContETFDynamic.ts";
import { MARCH_TYPES } from "@/models/util/constants";
import ContGateTurn from "@/models/continuity/ContGateTurn";

describe("components/menu-right/ContETFStaticEditor", () => {
  let editor: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let commitSpy: jest.SpyInstance;
  const stuntSheets = [
    new StuntSheet({
      beats: 4,
      title: "a",
      dotTypes: [
        [new ContETFDynamic(), new ContGateTurn(), new ContGateTurn()],
        [new ContGateTurn()],
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
      editor = mount(ContGateTurnEditor, {
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
        '[data-test="cont-gate-turn--march-type"]'
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

    it("changing duration", () => {
      const durationInput = editor.find(
        '[data-test="cont-gate-turn--duration"]'
      );
      expect(durationInput.exists()).toBe(true);
      const durationInputElement = durationInput.element as HTMLInputElement;
      expect(durationInputElement.value).toBe("8");
      expect(commitSpy).not.toHaveBeenCalled();
      durationInput.setValue("10");
      expect(commitSpy).toHaveBeenCalledWith(
        "updateDotTypeContinuity",
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].continuity.duration).toBe(10);
    });

    it("changing angle", () => {
      const selectAngle = editor.find(
        '[data-test="cont-gate-turn--angle"]'
      );
      expect(selectAngle.exists()).toBe(true);
      const selectAngleElement = selectAngle.element as HTMLSelectElement;
      expect(selectAngleElement.value).toBe(`180`);
      expect(commitSpy).not.toHaveBeenCalled();
      selectAngle.setValue(`90`);
      expect(commitSpy).toHaveBeenCalledWith(
        "updateDotTypeContinuity",
        expect.anything()
      );
      expect(commitSpy.mock.calls[0][1].continuity.angle).toBe(
        90
      );
    });

    it("can delete if more than one continuity exists for the dot type", async () => {
      const deleteButton = editor.find('[data-test="cont-etf-static--delete"]');
      expect(deleteButton.exists()).toBe(true);
      expect(commitSpy).not.toHaveBeenCalled();
      deleteButton.trigger("click");
      await editor.vm.$nextTick();
      expect(commitSpy).toHaveBeenCalledWith("deleteDotTypeContinuity", {
        dotTypeIndex: 0,
        continuityIndex: 1,
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
      editor = mount(ContGateTurnEditor, {
        store,
        localVue,
        propsData: {
          continuityIndex: 0,
          dotTypeIndex: 1,
        },
      });
    });

    it("can't delete if only one continuity exists for the dot type", async () => {
      const deleteButton = editor.find('[data-test="cont-etf-static--delete"]');
      expect(deleteButton.exists()).toBe(false);
    });
  });
});
