<template>
  <g class="grapher-dots--dots-container">
    <Dot
      v-for="(dot, index) in stuntSheetDots"
      :key="`${dot.id}-dots--dot`"
      class="grapher-dots--dot"
      data-test="grapher-dots--dot"
      :data-test-selected="selectedDotIds.includes(dot.id)"
      :transform="`translate(${dot.xAtBeat(beat)}, ${dot.yAtBeat(beat)})`"
      :dotTypeIndex="dot.dotTypeIndex"
      :label="indexedDotLabels[index]"
      :labeled="showDotLabels"
      :selected="selectedDotIds.includes(dot.id)"
    />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheetDot from "@/models/StuntSheetDot";
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
      return this.$store.getters.getSelectedStuntSheet.stuntSheetDots;
    },
    selectedDotIds(): number[] {
      return this.$store.state.selectedDotIds;
    },
    indexedDotLabels(): string[] {
      const dotLabels = this.$store.getters.getDotLabels;
      const dots: StuntSheetDot[] = this.$store.getters.getSelectedStuntSheet
        .stuntSheetDots;
      return dots.map((dot, index) => {
        return dot.dotLabelIndex !== null &&
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
