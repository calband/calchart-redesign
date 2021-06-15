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
      :isNextSS="false"
      :isConnected="dot.nextDotId !== null"
    />
    <template v-if="isViewModeFlow">
      <Dot
        v-for="[label, dot, isConnected, isSelected] in nextSSDots"
        :key="`${dot.id}-dots--dot`"
        class="grapher-dots--dot"
        :transform="`translate(${dot.xAtBeat(0)}, ${dot.yAtBeat(0)})`"
        :label="label"
        :labeled="showDotLabels"
        :selected="isSelected"
        :isNextSS="true"
        :isConnected="isConnected"
      />
    </template>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheetDot from "@/models/StuntSheetDot";
import Dot from "./Dot.vue";
import Show from "@/models/Show";
import { CalChartState } from "@/store";
import { VIEW_MODES } from "@/store/constants";

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
      return this.$store.state.selectedDotIds;
    },
    dotsWithLabels(): [string, StuntSheetDot][] {
      const show: Show = this.$store.state.show;
      return show.dotsWithLabelsForSS(this.$store.state.selectedSS);
    },
    beat: {
      get(): number {
        return this.$store.state.beat;
      },
    },
    isViewModeFlow(): boolean {
      return (this.$store.state as CalChartState).viewMode === VIEW_MODES.FLOW;
    },
    nextSSDots(): [string | null, StuntSheetDot, boolean, boolean][] {
      /**
       * Returns an array with contents:
       * 0: Previous dot's label
       * 1: StuntSheetDot from the next stuntsheet
       * 2: Boolean indicating if the dot is connected to the current stunt sheet
       * 3: Boolean indicating if the dot is connected to a selected dot on the current stunt sheet
       */
      const { show, selectedSS } = this.$store.state as CalChartState;
      if (selectedSS + 1 >= show.stuntSheets.length) {
        return [];
      }

      return show.stuntSheets[selectedSS + 1].stuntSheetDots.map((dot) => {
        const prevDotWithLabel = this.dotsWithLabels.find(
          ([, prevDot]) => prevDot.nextDotId === dot.id
        );
        return [
          prevDotWithLabel ? prevDotWithLabel[0] : null,
          dot,
          !!prevDotWithLabel,
          !!prevDotWithLabel &&
            this.selectedDotIds.includes(prevDotWithLabel[1].id),
        ];
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
