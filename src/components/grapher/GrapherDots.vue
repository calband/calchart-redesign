<template>
  <g class="grapher-dots--dots-container">
    <circle
      v-for="dot in stuntSheetDots"
      :key="`${dot.x}-${dot.y}-dots--dot`"
      class="grapher-dots--dot"
      :cx="dot.xAtBeat(beat - 1)"
      :cy="dot.yAtBeat(beat - 1)"
      r="0.7"
      data-test="grapher-dots--dot"
    />
    <g v-if="showDotLabels">
      <text
        v-for="(dot, index) in stuntSheetDots"
        :key="`${dot.x}-${dot.y}-dots--dottext`"
        class="grapher-dots--dottext"
        :x="dot.xAtBeat(beat - 1)"
        :y="dot.yAtBeat(beat - 1) - 1"
        data-test="grapher-dots--dottext"
      >
        {{ dotLabels[index] }}
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheetDot from "@/models/StuntSheetDot";
import StuntSheet from "@/models/StuntSheet";

/**
 * Renders the field, the dots of the current stunt sheet, and pending dots
 * generated from the tool in use
 */
export default Vue.extend({
  name: "GrapherDots",
  computed: {
    showDotLabels(): boolean {
      return this.$store.state.showDotLabels;
    },
    stuntSheetDots(): StuntSheetDot[] {
      const currentSS: StuntSheet = this.$store.getters.getSelectedStuntSheet;
      return currentSS.stuntSheetDots;
    },
    dotLabels(): string[] {
      const dotLabels = this.$store.getters.getDotLabels;
      const dots: StuntSheetDot[] = this.$store.getters.getSelectedStuntSheet
        .stuntSheetDots;
      return dots.map((dot, index) => {
        return dotLabels !== null &&
          dot.dotLabelIndex !== null &&
          dot.dotLabelIndex < dotLabels.length
          ? dotLabels[dot.dotLabelIndex]
          : index.toString();
      });
    },
    beat: {
      get(): number {
        return this.$store.state.beat;
      },
    },
  },
});
</script>

<style scoped lang="scss">
.grapher-dots--dottext {
  fill: $black;
  font-size: 2px;
  text-anchor: left;
  user-select: none;
}
</style>
