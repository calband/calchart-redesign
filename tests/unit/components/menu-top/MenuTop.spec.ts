import { Wrapper, createLocalVue, mount } from "@vue/test-utils";
import Vue, { VueConstructor } from "vue";
import Vuex, { Store } from "vuex";
import Buefy from "buefy";
import { CalChartState, generateStore } from "@/store";
import MenuTop from "@/components/menu-top/MenuTop.vue";

describe("components/menu-top/MenuTop", () => {
  let localVue: VueConstructor<Vue>;
  let wrapper: Wrapper<Vue>;
  let store: Store<CalChartState>;

  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = generateStore();
    wrapper = mount(MenuTop, {
      store,
      localVue,
    });
  });

  describe("file dropdown", () => {
    it("new show", () => {
      const newShow = wrapper.find('[data-test="menu-top--new-show"]');
      expect(newShow.exists()).toBeTruthy();
    });

    it('sets fileModal to true upon clicking "Edit Show Details"', async () => {
      expect(
        wrapper.find('[data-test="menu-top--file-modal"]').props("active")
      ).toBe(false);
      expect(
        wrapper.find('[data-test="menu-top--edit-show-details"]').exists()
      ).toBeTruthy();

      wrapper
        .find('[data-test="menu-top--edit-show-details"]')
        .trigger("click");
      await wrapper.vm.$nextTick();

      expect(
        wrapper.find('[data-test="menu-top--file-modal"]').props("active")
      ).toBe(true);
    });
  });

  describe("view dropdown", () => {
    it("four step grid checkbox", () => {
      expect(store.state.fourStepGrid).toBeTruthy();
      expect(
        wrapper.find('[data-test="menu-top--view-grid"]').exists()
      ).toBeTruthy();
      wrapper.find('[data-test="menu-top--view-grid"]').trigger("click");
      expect(store.state.fourStepGrid).toBeFalsy();
    });

    it("yardline checkbox", () => {
      expect(store.state.yardlines).toBeTruthy();
      expect(
        wrapper.find('[data-test="menu-top--view-yardlines"]').exists()
      ).toBeTruthy();
      wrapper.find('[data-test="menu-top--view-yardlines"]').trigger("click");
      expect(store.state.yardlines).toBeFalsy();
    });

    it("yardline number checkbox", () => {
      expect(store.state.yardlineNumbers).toBeTruthy();
      const viewNumbers = wrapper.find(
        '[data-test="menu-top--view-yardline-numbers"]'
      );
      expect(viewNumbers.exists()).toBeTruthy();
      viewNumbers.trigger("click");
      expect(store.state.yardlineNumbers).toBeFalsy();
    });

    it("show dot labels checkbox", () => {
      expect(store.state.showDotLabels).toBeTruthy();
      const viewNumbers = wrapper.find(
        '[data-test="menu-top--view-show-dot-labels"]'
      );
      expect(viewNumbers.exists()).toBeTruthy();
      viewNumbers.trigger("click");
      expect(store.state.showDotLabels).toBeFalsy();
    });
  });

  it("show field checkbox", () => {
    expect(store.state.showField).toBeTruthy();
    const showField = wrapper.find('[data-test="menu-top--view-show-field"]');
    expect(showField.exists()).toBeTruthy();
    showField.trigger("click");
    expect(store.state.showField).toBeFalsy();
  });
});
