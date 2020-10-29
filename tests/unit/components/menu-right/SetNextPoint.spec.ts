import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Buefy from "buefy";
import { generateStore, CalChartState } from "@/store";
import Vuex, { Store } from "vuex";
import SetNextPoint from "@/components/menu-right/SetNextPoint.vue";
import ToolSelectNextPoint from "@/tools/ToolSelectNextPoint";

describe("components/menu-right/SetNextPoint", () => {
  let setNextPoint: Wrapper<Vue>;
  let store: Store<CalChartState>;
  let tool: ToolSelectNextPoint;

  beforeAll(() => {
    // Mock out store and mount
    const localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(Buefy);
    store = generateStore();
    setNextPoint = mount(SetNextPoint, {
      store,
      localVue,
    });
    tool = new ToolSelectNextPoint();
  });

  it("toggles on set next point mode on click", async () => {
    expect(store.state.isSetNextPointMode).toBe(false);
    expect(
      setNextPoint.find('[data-test="set-next-point--message"]').exists()
    ).toBe(false);
    const switchBtn = setNextPoint.find('[data-test="set-next-point--switch"]');
    expect(switchBtn.exists());
    switchBtn.trigger("click");
    await setNextPoint.vm.$nextTick();
    expect(store.state.isSetNextPointMode).toBe(true);
    const message = setNextPoint.find('[data-test="set-next-point--message"]');
    expect(message.exists()).toBe(true);
    expect(message.text()).toBe(
      'Select the "Set Next Point" tool in the bottom menu.'
    );
  });

  it("updates the message upon selecting the next point tool", async () => {
    store.commit("setToolSelected", tool);
    await setNextPoint.vm.$nextTick();
    const message = setNextPoint.find('[data-test="set-next-point--message"]');
    expect(message.exists()).toBe(true);
    expect(message.text()).toBe(
      "Select a dot from the current stunt sheet to start from."
    );
  });

  it("updates the message upon selecting a dot", async () => {
    store.commit("updateToolSelectedNextPoint", 0);
    await setNextPoint.vm.$nextTick();
    const message = setNextPoint.find('[data-test="set-next-point--message"]');
    expect(message.exists()).toBe(true);
    expect(message.text()).toBe(
      "Select a dot from the next stunt sheet to end at."
    );
  });
});
