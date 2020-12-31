import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import MenuBottomTools from "@/components/menu-bottom/MenuBottomToolsz.vue";
import ToolSingleDot from "@/tools/ToolSingleDot";
import ToolBoxSelect from "@/tools/ToolBoxSelect";
import BaseTool from "@/tools/BaseTool";

jest.mock("@/tools/ToolSingleDot");
jest.mock("@/tools/ToolBoxSelect");

const setupHelper = () => {
  // Mock out store and mount
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(Buefy);
  const store = generateStore({});
  const menu = mount(MenuBottomTools, {
    store,
    localVue,
  });

  return {
    store,
    menu,
  };
};

describe("components/menu-bottom-tools/MenuBottom", () => {
  describe("tool buttons", () => {
    let store: Store<CalChartState>;
    let menu: Wrapper<Vue>;

    beforeAll(() => {
      jest.clearAllMocks();
      ({ store, menu } = setupHelper());
    });

    it("renders the correct amount of tools", () => {
      expect(menu.findAll('[data-test="menu-bottom-tools--tooltip"]')).toHaveLength(
        3
      );
    });

    it("on mount, selects the pan and zoom tool", () => {
      const toolSelected = store.state.toolSelected as BaseTool;
      expect(toolSelected).not.toBeUndefined();
      expect(ToolBoxSelect).toHaveBeenCalled();
      expect(toolSelected.constructor).toBe(ToolBoxSelect);
      const panZoomBtn = menu.find(
        '[data-test="menu-bottom-tools-tool--select-box-move"]'
      );
      expect(panZoomBtn.exists()).toBeTruthy();
      expect(panZoomBtn.props("type")).toBe("is-primary");
    });

    it("add/remove single dot has type is-light when it is unselected", () => {
      const addRmBtn = menu.find('[data-test="menu-bottom-tools-tool--add-rm"]');
      expect(addRmBtn.props("type")).toBe("is-light");
    });

    it("clicking add/remove single dot disables box select", async () => {
      expect(ToolSingleDot).not.toHaveBeenCalled();

      const addRmBtn = menu.find('[data-test="menu-bottom-tools-tool--add-rm"]');
      addRmBtn.trigger("click");
      await menu.vm.$nextTick();

      expect(ToolSingleDot).toHaveBeenCalled();
      const toolSelected = store.state.toolSelected as BaseTool;
      expect(toolSelected).not.toBeUndefined();
      expect(toolSelected.constructor).toBe(ToolSingleDot);
      expect(addRmBtn.props("type")).toBe("is-primary");
    });

    it("select box is no longer selected", () => {
      const panZoomBtn = menu.find(
        '[data-test="menu-bottom-tools-tool--select-box-move"]'
      );
      expect(panZoomBtn.props("type")).toBe("is-light");
    });

    it("clicking select box enables box", async () => {
      const panZoomBtn = menu.find(
        '[data-test="menu-bottom-tools-tool--select-box-move"]'
      );
      panZoomBtn.trigger("click");
      await menu.vm.$nextTick();

      const toolSelected = store.state.toolSelected as BaseTool;
      expect(toolSelected).not.toBeUndefined();
      expect(toolSelected.constructor).toBe(ToolBoxSelect);
      expect(panZoomBtn.props("type")).toBe("is-primary");
    });
  });
});
