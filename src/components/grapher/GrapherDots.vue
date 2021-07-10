<template>
  <g class="grapher-dots--dots-container">
    <Dot
      v-for="[label, dot] in dotsWithLabels"
      :key="`${dot.id}-dots--dot`"
      class="grapher-dots--dot"
      data-test="grapher-dots--dot"
      :data-test-selected="selectedDotIds.includes(dot.id)"
      :transform="`translate(${dot.xAtBeat(beat)}, ${dot.yAtBeat(beat)})`"
      :dotTypeIndex="dot.dotTypeIndex"
      :label="label"
      :labeled="showDotLabels"
      :selected="selectedDotIds.includes(dot.id)"
    />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheetDot from "@/models/StuntSheetDot";
import Dot from "./Dot.vue";
import Show from "@/models/Show";

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
    selectedDotIds(): number[] {
      return this.$store.getters.getSelectedDotIds;
    },
    dotsWithLabels(): [string, StuntSheetDot][] {
      const show: Show = this.$store.state.show;
      return show.dotsWithLabelsForSS(
        this.$store.getters.getSelectedStuntIndex
      );
    },
    beat: {
      get(): number {
        return this.$store.getters.getBeat;
      },
    },
  },
});
</script>

<style scoped lang="scss"></style>
