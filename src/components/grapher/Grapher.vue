<template>
  <div class="grapher">
    <svg
      class="grapher--svg"
      data-test="grapher--svg"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mousemove="onMouseMove"
    >
      <!-- Note:Inside svg, 1px = 1 eight-to-five step -->
      <g class="grapher--wrapper" data-test="grapher--wrapper">
        <GrapherField />
        <GrapherFlow />
        <GrapherDots />
        <GrapherTool />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GrapherField from "./GrapherField.vue";
import GrapherFlow from "./GrapherFlow.vue";
import GrapherDots from "./GrapherDots.vue";
import GrapherTool from "./GrapherTool.vue";
import svgPanZoom from "svg-pan-zoom";
import BaseTool from "@/tools/BaseTool";
import { Mutations } from "@/store/mutations";

/**
 * Holds the components for rendering the field, dots, tools, etc.
 */
export default Vue.extend({
  name: "Grapher",
  components: {
    GrapherField,
    GrapherFlow,
    GrapherDots,
    GrapherTool,
  },
  mounted() {
    const svgPanZoomInstance = svgPanZoom(".grapher--svg", {
      viewportSelector: ".grapher--wrapper",
      panEnabled: true,
      zoomEnabled: true,
      controlIconsEnabled: true,
      dblClickZoomEnabled: false,
    });
    this.$store.commit(Mutations.SET_GRAPHER_SVG_PAN_ZOOM, svgPanZoomInstance);

    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.$store.state.grapherSvgPanZoom.resize();
    },
    onMouseDown(event: MouseEvent): void {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      toolSelected.onMouseDown(event);
    },
    onMouseUp(event: MouseEvent): void {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      toolSelected.onMouseUp(event);
    },
    onMouseMove(event: MouseEvent): void {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      toolSelected.onMouseMove(event);
    },
  },
});
</script>

<style scoped lang="scss">
.grapher {
  grid-area: grapher;
  background: $stone-pine;
  position: relative;
}

.grapher--svg {
  width: 100%;
  height: 100%;
  // See PR#9
  position: absolute;
  top: 0;
  left: 0;
}
</style>
