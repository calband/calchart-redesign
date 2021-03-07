import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import MenuRight from "@/components/menu-right/MenuRight.vue";
import DotTypeEditor from "@/components/menu-right/DotTypeEditor.vue";
import StuntSheet from "@/models/StuntSheet";
import Show from "@/models/Show";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import DotAppearance from "@/models/DotAppearance";
import { Mutations } from "@/store/mutations";

describe("components/menu-right/MenuRight", () => {
  let menu: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let commitSpy: jest.SpyInstance;
  const stuntSheets = [
    new StuntSheet({
      beats: 4,
      title: "a",
      dotTypes: [
        [new ContInPlace()],
        [new ContETFDynamic(), new ContInPlace()],
      ],
      dotAppearances: [new DotAppearance(), new DotAppearance()],
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
    menu = mount(MenuRight, {
      store,
      localVue,
    });
  });

  it("renders all dot type editors", () => {
    const editors = menu.findAllComponents(DotTypeEditor);
    expect(editors).toHaveLength(2);
    const firstEditor = editors.at(0);
    expect(firstEditor.props("dotTypeIndex")).toBe(0);
    const secondEditor = editors.at(1);
    expect(secondEditor.props("dotTypeIndex")).toBe(1);
  });

  it("can add a dot type", async () => {
    const addBtn = menu.find('[data-se="menu-right--add-dot-type"]');
    expect(addBtn.exists()).toBe(true);
    expect(commitSpy).not.toHaveBeenCalled();
    addBtn.trigger("click");
    await menu.vm.$nextTick();
    expect(commitSpy).toHaveBeenCalledWith(Mutations.ADD_DOT_TYPE);
  });
});
