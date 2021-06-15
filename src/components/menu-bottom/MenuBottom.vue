<template>
  <div class="menu-bottom">
    <div class="buttons">
      <b-tooltip
        v-for="(toolData, index) in toolDataList"
        :key="`${toolData.icon}-toolData`"
        :label="toolData.label"
        data-test="menu-bottom--tooltip"
      >
        <b-button
          :type="toolSelectedIndex === index ? 'is-primary' : 'is-light'"
          :icon-left="toolData.icon"
          :data-test="`menu-bottom-tool--${toolData['data-test']}`"
          @click="setTool(index)"
        />
      </b-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * Handles setting and modifying the tools used in Grapher
 */
import Vue from "vue";
import BaseTool, { ToolConstructor } from "@/tools/BaseTool";
import ToolBoxSelect from "@/tools/ToolBoxSelect";
import ToolLassoSelect from "@/tools/ToolLassoSelect";
import ToolSingleDot from "@/tools/ToolSingleDot";
import ToolConnectDots from "@/tools/ToolConnectDots";
import { Mutations } from "@/store/mutations";
import { VIEW_MODES } from "@/store/constants";

interface ToolData {
  label: string;
  icon: string; // See https://materialdesignicons.com/
  tool: ToolConstructor;
  forceViewMode?: VIEW_MODES;
  "data-test": string;
}

export default Vue.extend({
  name: "MenuBottom",
  data: (): {
    toolDataList: ToolData[];
    toolSelectedIndex: number;
  } => ({
    toolDataList: [
      {
        label: "Drag Box to select, shift to add, shift+alt/option to toggle",
        icon: "hand-right",
        tool: ToolBoxSelect,
        "data-test": "select-box-move",
      },
      {
        label: "Lasso to select, shift to add, shift+alt/option to toggle",
        icon: "pencil",
        tool: ToolLassoSelect,
        "data-test": "select-lasso-move",
      },
      {
        label: "Add and Remove Single Dot",
        icon: "plus-minus",
        tool: ToolSingleDot,
        forceViewMode: VIEW_MODES.STUNTSHEET,
        "data-test": "add-rm",
      },
      {
        label: "Connect Dots between Stuntsheets",
        icon: "transit-connection-horizontal",
        tool: ToolConnectDots,
        forceViewMode: VIEW_MODES.FLOW,
        "data-test": "connect-dots",
      },
    ],
    toolSelectedIndex: 0, // Assume that 0 is the pan/zoom tool
  }),
  mounted() {
    this.setTool(this.$data.toolSelectedIndex);
  },
  methods: {
    setTool(toolIndex: number): void {
      this.$data.toolSelectedIndex = toolIndex;
      const toolItem = this.$data.toolDataList[toolIndex];
      const ToolConstructor: ToolConstructor = toolItem.tool;
      const tool: BaseTool = new ToolConstructor();
      this.$store.commit(Mutations.SET_TOOL_SELECTED, tool);
      if (!tool.supportsSelection) {
        this.$store.commit(Mutations.CLEAR_SELECTED_DOTS);
      }
      if (toolItem.forceViewMode) {
        this.$store.commit(Mutations.SET_VIEW_MODE, toolItem.forceViewMode);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.menu-bottom {
  grid-area: menu-bottom;
}

.buttons {
  height: 36px;
}
</style>
