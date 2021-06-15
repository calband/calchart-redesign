<template>
  <g v-if="isViewModeFlow">
    <g v-for="cachedFlow in selectedDotsFlows" :key="cachedFlow">
      <polyline
        class="grapher--flow-line"
        v-if="cachedFlow && cachedFlow.length > 1"
        :points="
          cachedFlow.map((flowBeat) => `${flowBeat.x},${flowBeat.y}`).join(` `)
        "
      />
    </g>
  </g>
</template>

<script lang="ts">
import { FlowBeat } from "@/models/util/FlowBeat";
import { CalChartState } from "@/store";
import { VIEW_MODES } from "@/store/constants";
import Vue from "vue";

/**
 * Renders each selected dots' cachedFlow.
 */
export default Vue.extend({
  name: "GrapherFlow",
  computed: {
    isViewModeFlow(): boolean {
      return this.$store.state.viewMode === VIEW_MODES.FLOW;
    },
    selectedDotsFlows(): (FlowBeat[] | null)[] {
      const { selectedDotIds, show, selectedSS } = this.$store
        .state as CalChartState;
      return show.stuntSheets[selectedSS].stuntSheetDots
        .filter((dot) => selectedDotIds.includes(dot.id))
        .map((dot) => dot.cachedFlow);
    },
  },
});
</script>

<style scoped lang="scss">
.grapher--flow-line {
  fill: none;
  stroke: $founders-rock;
  stroke-width: 0.75;
}
</style>
