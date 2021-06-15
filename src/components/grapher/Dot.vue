<template>
  <g class="dot--dot-container">
    <circle
      class="dot--circle"
      :r="radius"
      data-test="dot--circle"
      :stroke="selected ? 'yellow' : dotAppearance.color"
      stroke-width=".3"
      :fill="dotAppearance.fill"
      :fill-opacity="dotAppearance.filled ? 1 : 0"
    />
    <line
      v-if="dotAppearance.fwSlash"
      class="dot--line"
      data-test="dot--fslash"
      :stroke="selected ? 'yellow' : dotAppearance.color"
      :x1="radius * -1.1"
      :y1="radius * 1.1"
      :x2="radius * 1.1"
      :y2="radius * -1.1"
      stroke-width=".3"
    />
    <line
      v-if="dotAppearance.bwSlash"
      class="dot--line"
      data-test="dot--bslash"
      :stroke="selected ? 'yellow' : dotAppearance.color"
      :x1="radius * -1.1"
      :y1="radius * -1.1"
      :x2="radius * 1.1"
      :y2="radius * 1.1"
      stroke-width=".3"
    />
    <text
      v-if="labeled"
      class="dot--dottext"
      :y="-1"
      data-test="dot--dottext"
      :fill="selected ? 'yellow' : 'black'"
    >
      {{ label }}
    </text>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheet from "@/models/StuntSheet";
import DotAppearance from "@/models/DotAppearance";

const nextSSDotAppearance = new DotAppearance({
  filled: true,
  fill: "purple",
  color: "purple",
});

const nextSSUnconnectedDotAppearance = new DotAppearance({
  ...nextSSDotAppearance,
  fill: "deeppink",
  color: "deeppink",
});

/**
 * Renders a single dot
 */
export default Vue.extend({
  name: "Dot",
  props: {
    isNextSS: Boolean,
    dotTypeIndex: Number,
    label: String,
    labeled: Boolean,
    selected: Boolean,
    isConnected: Boolean,
  },
  computed: {
    radius(): number {
      return this.$props.isNextSS ? 0.5 : 0.7;
    },
    dotAppearance(): DotAppearance {
      if (this.$props.isNextSS) {
        return this.$props.isConnected
          ? nextSSDotAppearance
          : nextSSUnconnectedDotAppearance;
      }
      const currentSS: StuntSheet = this.$store.getters.getSelectedStuntSheet;
      return currentSS.dotAppearances[this.dotTypeIndex];
    },
  },
});
</script>

<style scoped lang="scss">
.dot--dottext {
  font-size: 2px;
  text-anchor: left;
  user-select: none;
}
</style>
