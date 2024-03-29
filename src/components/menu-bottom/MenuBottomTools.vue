<template>
  <div class="menu-bottom-tools">
    <div class="buttons">
      <b-tooltip
        v-for="(toolData, index) in toolDataList"
        :key="`${toolData.icon}-toolData`"
        :label="toolData.label"
        data-test="menu-bottom-tools--tooltip"
      >
        <b-button
          :type="toolSelectedIndex === index ? 'is-primary' : 'is-light'"
          :icon-left="toolData.icon"
          :data-test="`menu-bottom-tools-tool--${toolData['data-test']}`"
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
import { Mutations } from "@/store/mutations";

interface ToolData {
  label: string;
  icon: string;
  tool: ToolConstructor;
  "data-test": string;
}

export default Vue.extend({
  name: "MenuBottomTools",
  data: (): {
    toolDataList: ToolData[];
    toolSelectedIndex: number;
  } => ({
    toolDataList: [
      {
        label: "Drag Box to select, shift to add, shift+alt/option to toggle",
        icon: "select",
        tool: ToolBoxSelect,
        "data-test": "select-box-move",
      },
      {
        label: "Lasso to select, shift to add, shift+alt/option to toggle",
        icon: "lasso",
        tool: ToolLassoSelect,
        "data-test": "select-lasso-move",
      },
      {
        label: "Add and Remove Single Dot",
        icon: "plus-minus",
        tool: ToolSingleDot,
        "data-test": "add-rm",
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
      console.log("which tool ", toolIndex);
      const ToolConstructor: ToolConstructor = this.$data.toolDataList[
        toolIndex
      ].tool;
      const tool: BaseTool = new ToolConstructor();
      this.$store.commit(Mutations.SET_TOOL_SELECTED, tool);
      if (!tool.supportsSelection) {
        this.$store.commit(Mutations.CLEAR_SELECTED_DOTS);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.menu-bottom-tools {
  grid-area: menu-bottom-tools;
}

.buttons {
  height: 24px;
}
</style>
