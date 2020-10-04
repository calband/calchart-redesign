import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import DotTypeEditor from "@/components/menu-right/DotTypeEditor.vue";
import ContEditorHelper from "@/components/menu-right/ContEditorHelper.vue";
import StuntSheet from "@/models/StuntSheet";
import Show from "@/models/Show";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";

describe("components/menu-right/DotTypeEditor", () => {
  let editor: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let commitSpy: jest.SpyInstance;
  const stuntSheets = [
    new StuntSheet({
      beats: 4,
      title: "a",
      dotTypes: [
        [new ContETFDynamic(), new ContInPlace()],
        [new ContInPlace()],
      ],
    }),
    new StuntSheet({ beats: 8, title: "b" }),
  ];
  const show = new Show({ stuntSheets });

  beforeEach(() => {
    // Mock out store and mount
    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = generateStore({ show });
    commitSpy = jest.spyOn(store, "commit");
    editor = mount(DotTypeEditor, {
      store,
      localVue,
      propsData: {
        dotTypeIndex: 0,
      },
    });
  });

  it("renders all continuity editors", () => {
    const contEditors = editor.findAllComponents(ContEditorHelper);
    expect(contEditors).toHaveLength(2);
    const firstCont = contEditors.at(0);
    expect(firstCont.props("continuityIndex")).toBe(0);
    expect(firstCont.props("dotTypeIndex")).toBe(0);
    const secondCont = contEditors.at(1);
    expect(secondCont.props("continuityIndex")).toBe(1);
    expect(secondCont.props("dotTypeIndex")).toBe(0);
  });

  it("add in place continuity", async () => {
    const addInPlaceBtn = editor.find('[data-test="menu-right--add-in-place"]');
    expect(addInPlaceBtn.exists()).toBe(true);
    expect(commitSpy).not.toHaveBeenCalled();
    addInPlaceBtn.trigger("click");
    await editor.vm.$nextTick();
    expect(commitSpy).toHaveBeenCalledWith("addContinuity", expect.anything());
    expect(commitSpy.mock.calls[0][1].continuity instanceof ContInPlace).toBe(
      true
    );
  });

  it("add eight to five dynamic continuity", async () => {
    const addETFDynamicBtn = editor.find(
      '[data-test="menu-right--add-etf-dynamic"]'
    );
    expect(addETFDynamicBtn.exists()).toBe(true);
    expect(commitSpy).not.toHaveBeenCalled();
    addETFDynamicBtn.trigger("click");
    await editor.vm.$nextTick();
    expect(commitSpy).toHaveBeenCalledWith("addContinuity", expect.anything());
    expect(
      commitSpy.mock.calls[0][1].continuity instanceof ContETFDynamic
    ).toBe(true);
  });
});
