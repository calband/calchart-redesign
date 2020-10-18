<template>
  <g class="grapher-dots--dots-container">
    <Dot
      v-for="(dot, index) in stuntSheetDots"
      :key="`${dot.x}-${dot.y}-dots--dot`"
      class="grapher-dots--dot"
      data-test="grapher-dots--dot"
      :transform="`translate(${dot.xAtBeat(beat - 1)}, ${dot.yAtBeat(
        beat - 1
      )})`"
      :cx="dot.xAtBeat(beat - 1)"
      :cy="dot.yAtBeat(beat - 1)"
      :dotTypeIndex="dot.dotTypeIndex"
      :label="dotLabels[index]"
      :labeled="showDotLabels"
    />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheetDot from "@/models/StuntSheetDot";
import StuntSheet from "@/models/StuntSheet";
import Dot from "./Dot.vue";

/**
 * Renders the field, the dots of the current stunt sheet, and pending dots
 * generated from the tool in use
 */
export default Vue.extend({
  name: "GrapherDots",
  components: {
    Dot,
  },
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

<style scoped lang="scss"></style>
