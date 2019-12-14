<template>
  <div class="menu-bottom">
    <div class="buttons">
      <b-tooltip
        v-for="(toolData, index) in toolDataList"
        :key="index + 'toolData'"
        :label="toolData.label"
        :delay="500"
      >
        <b-button
          :type="toolSelectedIndex === index ? 'is-primary' : 'is-light'"
          :icon-left="toolData.icon"
          data-test="menu-bottom--tool-button"
          @click="setTool(index)"
        />
      </b-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BaseTool, { ToolConstructor } from '@/tools/BaseTool';
import ToolPanZoom from '../../tools/ToolPanZoom';
import ToolSingleDot from '../../tools/ToolSingleDot';

interface ToolData {
  label: string;
  icon: string;
  tool: ToolConstructor;
}

export default Vue.extend({
  name: 'MenuBottom',
  data: (): {
    toolDataList: ToolData[];
    toolSelectedIndex: number;
  } => ({
    toolDataList: [
      {
        label: 'Pan and Zoom',
        icon: 'hand-right',
        tool: ToolPanZoom,
      },
      {
        label: 'Add and Remove Single Dot',
        icon: 'plus-minus',
        tool: ToolSingleDot,
      },
    ],
    toolSelectedIndex: 0, // Assume that 0 is the pan/zoom tool
  }),
  watch: {
    toolSelectedIndex(newIndex: number, oldIndex: number) {
      // Enable or disable pan/zoom depending on tool selected
      const grapherSvgPanZoom: SvgPanZoom.Instance | undefined
        = this.$store.state.grapherSvgPanZoom;
      if (grapherSvgPanZoom === undefined) {
        return;
      }

      if (newIndex === 0 && oldIndex !== 0) {
        grapherSvgPanZoom.enablePan();
        grapherSvgPanZoom.enableZoom();
        grapherSvgPanZoom.enableControlIcons();
      } else if (oldIndex === 0 && newIndex !== 0) {
        grapherSvgPanZoom.disablePan();
        grapherSvgPanZoom.disableZoom();
        grapherSvgPanZoom.disableControlIcons();

        // Calculate inverted CTM matrix that is used to convert ClientX/Y to
        // X/Y of the SVG
        const wrapper = document
          .getElementsByClassName('grapher--wrapper')[0] as SVGGElement;
        const ctm = wrapper.getScreenCTM();
        if (!ctm) {
          throw 'Unable to retrieve wrapper CTM';
        }
        const invertedMatrix = ctm.inverse();
        this.$store.commit('setInvertedCTMMatrix', invertedMatrix);
      }
    },
  },
  mounted () {
    this.setTool(this.$data.toolSelectedIndex);
  },
  methods: {
    setTool(toolIndex: number): void {
      this.$data.toolSelectedIndex = toolIndex;
      const ToolConstructor: ToolConstructor
        = this.$data.toolDataList[toolIndex].tool;
      const tool: BaseTool
        = new ToolConstructor(this.$store);
      this.$store.commit('setToolSelected', tool);
    },
  },
});
</script>

<style scoped lang="scss">

</style>
