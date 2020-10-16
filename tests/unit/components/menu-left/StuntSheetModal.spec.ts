import { Wrapper, createLocalVue, mount } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import Buefy from "buefy";
import { CalChartState, generateStore } from "@/store";
import StuntSheetModal from "@/components/menu-left/StuntSheetModal.vue";
import StuntSheet from "@/models/StuntSheet";

describe("components/menu-left/StuntSheetModal", () => {
  let localVue: VueConstructor<Vue>;
  let wrapper: Wrapper<Vue>;
  let store: Store<CalChartState>;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = generateStore();
    wrapper = mount(StuntSheetModal, {
      store,
      localVue,
    });
  });

  it("Stuntsheet title", async () => {
    const title = wrapper.find('[data-test="ss-modal--title"]');
    expect(title.exists()).toBeTruthy();
    const stuntSheet: StuntSheet = store.getters.getSelectedStuntSheet;
    expect((title.element as HTMLInputElement).value).toBe(stuntSheet.title);

    title.setValue("Rainbow");
    await wrapper.vm.$nextTick();

    expect(stuntSheet.title).toBe("Rainbow");
  });

  it("Stuntsheet beats", async () => {
    const beats = wrapper.find('[data-test="ss-modal--beats"]');
    expect(beats.exists()).toBeTruthy();
    const stuntSheet: StuntSheet = store.getters.getSelectedStuntSheet;
    expect((beats.element as HTMLInputElement).value).toBe(
      stuntSheet.beats.toString()
    );

    beats.setValue(2);
    await wrapper.vm.$nextTick();

    expect(stuntSheet.beats).toBe(2);
  });

  it("delete stuntsheet button does not show with 1 sheet", async () => {
    store.state.show.stuntSheets = [new StuntSheet()];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="ss-modal--delete"]').exists()).toBe(false);
  });

  it("delete stuntsheet", async () => {
    store.state.show.stuntSheets = [
      new StuntSheet({ title: "a" }),
      new StuntSheet({ title: "b" }),
    ];
    store.state.selectedSS = 0;
    const parentCloseMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm.$parent as any).close = parentCloseMock;
    await wrapper.vm.$nextTick();

    const deleteBtn = wrapper.find('[data-test="ss-modal--delete"]');
    expect(deleteBtn.exists()).toBeTruthy();
    expect(parentCloseMock).not.toHaveBeenCalled();
    deleteBtn.trigger("click");
    await wrapper.vm.$nextTick();

    expect(store.state.show.stuntSheets).toHaveLength(1);
    expect(store.state.show.stuntSheets[0].title).toBe("b");
    expect(parentCloseMock).toHaveBeenCalled();
  });
});
