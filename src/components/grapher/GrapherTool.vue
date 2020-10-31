<template>
  <g class="grapher-tool--tool-dots-container">
    <circle
      v-for="dot in grapherToolDots"
      :key="`${dot.x}-${dot.y}-tool--dot`"
      class="grapher-tool--dot"
      :cx="dot.x"
      :cy="dot.y"
      r="0.7"
      data-test="grapher-tool--dot"
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
  },
});
</script>

<style scoped lang="scss">
.grapher-tool--dot {
  opacity: 0.5;
}
.grapher-tool--box {
  stroke: $yellow;
  stroke-width: 0.5;
  opacity: 0.5;
}
</style>
