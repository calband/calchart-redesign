<template>
  <div class="persheetpreview">
    <svg class="persheetpreview-svg"><g>
      <!-- Note:Inside svg, 1px = 1 eight-to-five step -->
      <g class="persheetpreview--line-container">
        <rect
          class="persheetpreview--field-rect"
          :width="fieldWidth"
          :height="fieldHeight"
        />
        <line
          v-for="offsetX in yardLineOffsetsX"
          :key="offsetX + '-yardLine'"
          :x1="offsetX"
          y1="0"
          :x2="offsetX"
          :y2="fieldHeight"
          data-test="grapher--yard-line"
        />
      </g>
    </g></svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import svgPanZoom from 'svg-pan-zoom';

export default Vue.extend({
  name: 'PerSheetPreview',
  computed: {
    yardLineOffsetsX(): number[] {
      const middleOfField = this.$store.getters.getMiddleOfField;
      const yardLineOffsetsX: number[] = [];
      let x = 16;
      for (let lineNum = 0; lineNum < middleOfField; lineNum += 5) {
        yardLineOffsetsX.push(x);
        x += 8;
      }
      for (let lineNum = middleOfField; lineNum >= 0; lineNum -= 5) {
        yardLineOffsetsX.push(x);
        x += 8;
      }
      return yardLineOffsetsX;
    },
    fieldWidth(): number {
      // Account for endzones + area between yard lines
      return 16 + 8 * (this.yardLineOffsetsX.length - 1) + 16;
    },
    fieldHeight(): number {
      return this.$store.getters.getBackHashOffsetY
             + this.$store.getters.getFrontHashOffsetY;
    },
  },
  mounted: () => {
    svgPanZoom('.persheetpreview-svg', {
      dblClickZoomEnabled: false,
    });
  },
});
</script>

<style scoped lang="scss">
.persheetpreview-svg {
  flex: 1 1;
  background: $stone-pine;
  position: relative;
}

.persheetpreview--line-container {
  stroke: $white;
  stroke-width: 0.5;
}

.persheetpreview--field-rect {
  fill: $soybean;
}
</style>
