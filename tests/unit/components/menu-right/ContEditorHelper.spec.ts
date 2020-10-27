import { createLocalVue, mount } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import ContEditorHelper from "@/components/menu-right/ContEditorHelper.vue";
import ContInPlaceEditor from "@/components/menu-right/ContInPlaceEditor.vue";
import ContETFDynamicEditor from "@/components/menu-right/ContETFDynamicEditor.vue";
import ContEvenEditor from "@/components/menu-right/ContEvenEditor.vue";
import StuntSheet from "@/models/StuntSheet";
import Show from "@/models/Show";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import ContEven from "@/models/continuity/ContEven";
import { VueConstructor } from "vue/types/umd";

describe("components/menu-right/ContEditorHelper", () => {
  let store: Store<CalChartState>;
  const stuntSheets = [
    new StuntSheet({
      beats: 4,
      title: "a",
      dotTypes: [
        [new ContETFDynamic(), new ContInPlace(), new ContEven()],
        [new ContInPlace()],
      ],
    }),
    new StuntSheet({ beats: 8, title: "b" }),
  ];
  const show = new Show({ stuntSheets });
  let localVue: VueConstructor;

  beforeEach(() => {
    // Mock out store and mount
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = generateStore({ show });
  });

  it("renders in place editor", () => {
    const editor = mount(ContEditorHelper, {
      store,
      localVue,
      propsData: {
        continuityIndex: 1,
        dotTypeIndex: 0,
      },
    });
    const etfDynamicEditor = editor.findComponent(ContInPlaceEditor);
    expect(etfDynamicEditor.exists()).toBe(true);
    expect(etfDynamicEditor.props("continuityIndex")).toBe(1);
    expect(etfDynamicEditor.props("dotTypeIndex")).toBe(0);
  });

  it("renders eight to five dynamic editor", () => {
    const editor = mount(ContEditorHelper, {
      store,
      localVue,
      propsData: {
        continuityIndex: 0,
        dotTypeIndex: 0,
      },
    });
    const etfDynamicEditor = editor.findComponent(ContETFDynamicEditor);
    expect(etfDynamicEditor.exists()).toBe(true);
    expect(etfDynamicEditor.props("continuityIndex")).toBe(0);
    expect(etfDynamicEditor.props("dotTypeIndex")).toBe(0);
  });
  it("renders even editor", () => {
    const editor = mount(ContEditorHelper, {
      store,
      localVue,
      propsData: {
        continuityIndex: 2,
        dotTypeIndex: 0,
      },
    });
    const etfDynamicEditor = editor.findComponent(ContEvenEditor);
    expect(etfDynamicEditor.exists()).toBe(true);
    expect(etfDynamicEditor.props("continuityIndex")).toBe(2);
    expect(etfDynamicEditor.props("dotTypeIndex")).toBe(0);
  });
});
