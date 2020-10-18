<template>
  <div class="grapher">
    <svg
      class="grapher--svg"
      data-test="grapher--svg"
      @click.prevent="onClick"
      @mousemove="onMousemove"
    >
      <g class="grapher--wrapper" data-test="grapher--wrapper">
        <GrapherField />
        <GrapherDots />
        <GrapherTool />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GrapherField from "./GrapherField.vue";
import GrapherDots from "./GrapherDots.vue";
import GrapherTool from "./GrapherTool.vue";
import svgPanZoom from "svg-pan-zoom";
import BaseTool from "@/tools/BaseTool";

/**
 * Renders the field, the dots of the current stunt sheet, and pending dots
 * generated from the tool in use
 */
export default Vue.extend({
  name: "Grapher",
  components: {
    GrapherField,
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
    this.$store.commit("setGrapherSvgPanZoom", svgPanZoomInstance);

    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.$store.state.grapherSvgPanZoom.resize();
    },
    onClick(event: MouseEvent): void {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      toolSelected.onClick(event);
    },
    onMousemove(event: MouseEvent): void {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      toolSelected.onMousemove(event);
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
