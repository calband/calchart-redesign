<template>
  <g class="grapher-dots--dots-container">
    <circle
      v-for="dot in stuntSheetDotsUnselected"
      :key="`${dot.x}-${dot.y}-dots--dot`"
      class="grapher-dots--dot"
      :cx="dot.xAtBeat(beat - 1)"
      :cy="dot.yAtBeat(beat - 1)"
      r="0.7"
      data-test="grapher-dots--dot"
    />
    <circle
      v-for="dot in stuntSheetDotsSelected"
      :key="`${dot.x}-${dot.y}-dots--dot-selected`"
      class="grapher-dots--dot-selected"
      :cx="dot.xAtBeat(beat - 1)"
      :cy="dot.yAtBeat(beat - 1)"
      r="0.7"
      data-test="grapher-dots--dot-selected"
    />
    <g v-if="showDotLabels">
      <text
        v-for="dot in dotLabelsUnselected"
        :key="`${dot[0].x}-${dot[0].y}-dots--dottext`"
        class="grapher-dots--dottext"
        :x="dot[0].xAtBeat(beat - 1)"
        :y="dot[0].yAtBeat(beat - 1) - 1"
        data-test="grapher-dots--dottext"
      >
        {{ dot[1] }}
      </text>
    </g>
    <g v-if="showDotLabels">
      <text
        v-for="dot in dotLabelsSelected"
        :key="`${dot[0].x}-${dot[0].y}-dots--dottext-selected`"
        class="grapher-dots--dottext-selected"
        :x="dot[0].xAtBeat(beat - 1)"
        :y="dot[0].yAtBeat(beat - 1) - 1"
        data-test="grapher-dots--dottext-selected"
      >
        {{ dot[1] }}
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheetDot from "@/models/StuntSheetDot";

/**
 * Renders the dots of the current stunt sheet.
 */
export default Vue.extend({
  name: "GrapherDots",
  computed: {
    showDotLabels(): boolean {
      return this.$store.state.showDotLabels;
    },
    stuntSheetDots(): StuntSheetDot[] {
      return this.$store.getters.getSelectedStuntSheet.stuntSheetDots;
    },
    stuntSheetDotsUnselected(): StuntSheetDot[] {
      const selectedDots = this.$store.state.selectedDots;
      return this.stuntSheetDots.filter((dot: StuntSheetDot, index: number) => {
        return !selectedDots.includes(index);
      });
    },
    stuntSheetDotsSelected(): StuntSheetDot[] {
      const selectedDots = this.$store.state.selectedDots;
      return this.stuntSheetDots.filter((dot: StuntSheetDot, index: number) => {
        return selectedDots.includes(index);
      });
    },
    dotLabels(): [StuntSheetDot, string][] {
      const dotLabels = this.$store.getters.getDotLabels;
      const dots: StuntSheetDot[] = this.$store.getters.getSelectedStuntSheet
        .stuntSheetDots;
      return dots.map((dot, index) => {
        return [
          dot,
          dotLabels !== null &&
          dot.dotLabelIndex !== null &&
          dot.dotLabelIndex < dotLabels.length
            ? dotLabels[dot.dotLabelIndex]
            : index.toString(),
        ];
      });
    },
    dotLabelsUnselected(): [StuntSheetDot, string][] {
      const selectedDots = this.$store.state.selectedDots;
      return this.dotLabels.filter(
        (dotLabel: [StuntSheetDot, string], index: number) => {
          return !selectedDots.includes(index);
        }
      );
    },
    dotLabelsSelected(): [StuntSheetDot, string][] {
      const selectedDots = this.$store.state.selectedDots;
      return this.dotLabels.filter(
        (dotLabel: [StuntSheetDot, string], index: number) => {
          return selectedDots.includes(index);
        }
      );
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
.grapher-dots--dot-selected {
  fill: $yellow;
}

.grapher-dots--dottext {
  fill: $black;
  font-size: 1px;
  text-anchor: left;
  user-select: none;
}

.grapher-dots--dottext-selected {
  fill: $yellow;
  font-size: 1px;
  text-anchor: left;
  user-select: none;
}

.grapher-dots--dottext-selected {
  fill: $yellow;
  font-size: 2px;
  text-anchor: left;
  user-select: none;
}
</style>
