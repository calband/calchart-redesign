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

interface ToolData {
  label: string;
  icon: string;
  tool: ToolConstructor;
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
      const ToolConstructor: ToolConstructor = this.$data.toolDataList[
        toolIndex
      ].tool;
      const tool: BaseTool = new ToolConstructor();
      this.$store.commit("setToolSelected", tool);
    },
  },
});
</script>

<style scoped lang="scss">
.menu-bottom {
  grid-area: menu-bottom;
}
</style>
