<template>
<div class="grapher">
  <svg class="grapher-svg"><g> <!-- Note: we wrap the entire svg in a g so that svgPanZoom doesn't
            have to create a new g and Vue loses track of the DOM elements. -->
    <!-- Note:Inside svg, 1px = 1 eight-to-five step -->
    <g class="grapher--line-container">
      <rect
        class="grapher--field-rect"
        v-bind:width="fieldWidth"
        v-bind:height="fieldHeight"
      />
      <line
        v-for="offsetX in yardLineOffsetsX"
        v-bind:key="offsetX + '-yardLine'"
        v-bind:x1="offsetX"
        y1="0"
        v-bind:x2="offsetX"
        v-bind:y2="fieldHeight"
        data-test="grapher--yard-line"
      />
      <template v-for="offsetY in hashMarkOffsetsY">
        <line
          v-for="offsetX in yardLineOffsetsX"
          v-bind:key="offsetX + '-' + offsetY + '-hashMark'"
          v-bind:x1="offsetX - 0.75"
          v-bind:y1="offsetY"
          v-bind:x2="offsetX + 0.75"
          v-bind:y2="offsetY"
          data-test="grapher--hash-mark"
        />
      </template>
    </g>
    <g v-if="fourStepGrid" class="grapher--grid-container">
      <line
        v-for="offsetX in fourStepGridOffsetsX"
        v-bind:key="offsetX + '-vertical'"
        v-bind:x1="offsetX"
        y1="-0.125"
        v-bind:x2="offsetX"
        v-bind:y2="fieldHeight"
        data-test="grapher--grid-vertical"
      />
      <line
        v-for="offsetY in fourStepGridOffsetsY"
        v-bind:key="offsetY + '-horizontal'"
        x1="-0.125"
        v-bind:y1="offsetY"
        v-bind:x2="fieldWidth"
        v-bind:y2="offsetY"
        data-test="grapher--grid-horizontal"
      />
    </g>
    <g class="grapher--number-container">
      <!-- Bottom of the yard line numbers is approximately 11 steps from the sideline -->
      <text
        v-for="(numberAndOffsetX, index) in yardLineNumberAndOffsetX"
        v-bind:key="index + '-yardNum'"
        v-bind:x="numberAndOffsetX[1]"
        v-bind:y="fieldHeight - 11"
        data-test="grapher--yard-number"
      >
        {{ numberAndOffsetX[0] }}
      </text>
      <text
        v-for="(numberAndOffsetX, index) in yardLineNumberAndOffsetX"
        v-bind:key="index + '-yardNumRotated'"
        v-bind:x="numberAndOffsetX[1]"
        v-bind:y="11"
        v-bind:transform="'rotate(180 ' + numberAndOffsetX[1] + ' 11)'"
        data-test="grapher--yard-number"
      >
        {{ numberAndOffsetX[0] }}
      </text>
    </g>
  </g></svg>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import svgPanZoom from 'svg-pan-zoom';

export default Vue.extend({
  name: 'Grapher',
  computed: {
    hashMarkOffsetsY(): number[] {
      return this.$store.state.hashMarkOffsetsY;
    },
    yardLineOffsetsX(): number[] {
      const { middleOfField } = this.$store.state;
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
    fourStepGrid(): boolean {
      return this.$store.state.fourStepGrid;
    },
    fieldWidth(): number {
      // Account for endzones + area between yard lines
      return 16 + 8 * (this.yardLineOffsetsX.length - 1) + 16;
    },
    fieldHeight(): number {
      return this.hashMarkOffsetsY[1] + this.hashMarkOffsetsY[0];
    },
    fourStepGridOffsetsX(): number[] {
      // Do not render a vertical line if there is a yard line
      const retVal: number[] = [
        4,
        8,
        12,
        this.fieldWidth - 12,
        this.fieldWidth - 8,
        this.fieldWidth - 4,
      ];
      for (let offsetX = 20; offsetX < this.fieldWidth - 16; offsetX += 8) {
        retVal.push(offsetX);
      }
      return retVal;
    },
    fourStepGridOffsetsY(): number[] {
      const retVal: number[] = [];
      for (let offsetY = 4; offsetY < this.fieldHeight; offsetY += 4) {
        retVal.push(offsetY);
      }
      return retVal;
    },
    yardLineNumberAndOffsetX(): [string, number][] {
      const retVal: [string, number][] = [];
      let yardLineNumber: number = 1;
      for (let lineIndex = 2; lineIndex < this.yardLineOffsetsX.length / 2; lineIndex += 2) {
        retVal.push([
          `${yardLineNumber.toString()} 0`,
          this.yardLineOffsetsX[lineIndex],
        ]);
        const oppositeLineIndex = this.yardLineOffsetsX.length - 1 - lineIndex;
        if (oppositeLineIndex !== lineIndex) {
          retVal.push([
            `${yardLineNumber.toString()} 0`,
            this.yardLineOffsetsX[oppositeLineIndex],
          ]);
        }
        yardLineNumber += 1;
      }
      return retVal;
    },
  },
  mounted: () => {
    svgPanZoom('.grapher-svg', {
      controlIconsEnabled: true,
      dblClickZoomEnabled: false,
    });
  },
});
</script>

<style scoped lang="scss">
.grapher {
  flex: 1 1;
  background: $stone-pine;
  position: relative;
}

.grapher-svg {
  // https://stackoverflow.com/questions/7570917/svg-height-incorrectly-calculated-in-webkit-browsers
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.grapher--line-container {
  stroke: $white;
  stroke-width: 0.5;
}

.grapher--grid-container {
  stroke: $white;
  stroke-width: 0.125;
  stroke-dasharray: 0.25 0.75;
}

.grapher--number-container {
  fill: $white;
  font-size: 4px;
  text-anchor: middle;
}

.grapher--field-rect {
  fill: $soybean;
}
</style>
