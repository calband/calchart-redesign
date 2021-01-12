<template>
  <g class="grapher-tool--tool-dots-container">
    <circle
      v-for="(dot, index) in grapherToolDots"
      :key="`${index}-tool--dot`"
      class="grapher-tool--dot"
      :cx="dot.x"
      :cy="dot.y"
      r="0.7"
      data-test="grapher-tool--dot"
    />
    <g v-if="showDotLabels">
      <text
        v-for="dot in grapherToolDotLabels"
        :key="`${dot[0].x}-${dot[0].y}-tool--dottext`"
        class="grapher-tool--dottext"
        :x="dot[0].x"
        :y="dot[0].y - 1"
        data-test="grapher-tool--dottext"
      >
        {{ dot[1] }}
      </text>
    </g>
    <polyline
      v-if="showSelectionLasso"
      class="grapher-tool--selection-lasso"
      :points="selectionLasso"
      fill="none"
      data-test="grapher-tool--selection-lasso"
    />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheetDot from "@/models/StuntSheetDot";

/**
 * Renders the pending dots generated from the tool in use.
 */
export default Vue.extend({
  name: "GrapherTool",
  computed: {
    grapherToolDots(): StuntSheetDot[] {
      return this.$store.state.grapherToolDots;
    },
    showDotLabels(): boolean {
      return this.$store.state.showDotLabels;
    },
    grapherToolDotLabels(): [StuntSheetDot, string][] {
      const dotLabels = this.$store.getters.getDotLabels;
      const dots: StuntSheetDot[] = this.grapherToolDots;
      return dots.map((dot) => {
        return [
          dot,
          dotLabels !== null &&
          dot.dotLabelIndex !== null &&
          dot.dotLabelIndex < dotLabels.length
            ? dotLabels[dot.dotLabelIndex]
            : "",
        ];
      });
    },
    showSelectionLasso(): boolean {
      return this.$store.state.showSelectionLasso;
    },
    selectionLasso(): string {
      // construct a string ready to be used by polyline.  See:
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline
      const lassoPointStrings: string[] = this.$store.state.selectionLasso.map(
        (point: [number, number]) => point.join(",")
      );
      return lassoPointStrings.join(" ");
    },
  },
});
</script>

<style scoped lang="scss">
.grapher-tool--dot {
  opacity: 0.5;
}
.grapher-tool--dottext {
  fill: $black;
  font-size: 1px;
  text-anchor: left;
  user-select: none;
}
.grapher-tool--selection-lasso {
  stroke: $yellow;
  stroke-width: 0.5;
  opacity: 0.5;
}
</style>
