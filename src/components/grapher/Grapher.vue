<template>
<div class="grapher">
  <svg
    class="grapher-svg"
    width="100%"
    height="100%"
  >
    <!-- Inside svg, 1px = 1 eight-to-five step -->
    <g stroke="white" stroke-width="0.5">
      <rect
        fill="green"
        v-bind:width="fieldWidth"
        v-bind:height="fieldHeight"
      />
      <line
        v-for="yardLine in yardLines"
        v-bind:key="yardLine + '-yardLine'"
        v-bind:x1="yardLine"
        y1="0"
        v-bind:x2="yardLine"
        v-bind:y2="fieldHeight"
      />
      <template v-for="hashMark in hashMarks">
        <line
          v-for="yardLine in yardLines"
          v-bind:key="hashMark + yardLine + '-hashMark'"
          v-bind:x1="yardLine - 0.75"
          v-bind:y1="hashMark"
          v-bind:x2="yardLine + 0.75"
          v-bind:y2="hashMark"
        />
      </template>
    </g>
    <g stroke="white" stroke-width="0.125" stroke-dasharray="0.25 0.75">
      <line
        v-for="x in dashedLinesVertical"
        v-bind:key="x + '-vertical'"
        v-bind:x1="x"
        y1="-0.125"
        v-bind:x2="x"
        v-bind:y2="fieldHeight"
      />
      <line
        v-for="y in dashedLinesHorizontal"
        v-bind:key="y + '-horizontal'"
        x1="-0.125"
        v-bind:y1="y"
        v-bind:x2="fieldWidth"
        v-bind:y2="y"
      />
    </g>
    <g fill=white font-size="3" text-anchor="middle">
      <!-- Bottom of the yard line numbers is approximately 11 steps from the sideline -->
      <text
        v-for="(yardLineNumber, index) in yardLineNumbers"
        v-bind:key="index + '-yardNum'"
        v-bind:x="yardLineNumber[0]"
        v-bind:y="fieldHeight - 11"
      >
        {{ yardLineNumber[1] }}
      </text>
      <text
        v-for="(yardLineNumber, index) in yardLineNumbers"
        v-bind:key="index + '-yardNumRotated'"
        v-bind:x="yardLineNumber[0]"
        v-bind:y="11"
        v-bind:transform="'rotate(180 ' + yardLineNumber[0] + ' 11)'"
      >
        {{ yardLineNumber[1] }}
      </text>
    </g>
  </svg>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import svgPanZoom from 'svg-pan-zoom';

export default Vue.extend({
  name: 'Grapher',
  computed: {
    yardLines(): number[] {
      return this.$store.state.yardLines;
    },
    hashMarks(): number[] {
      return this.$store.state.hashMarks;
    },
    fieldWidth(): number {
      // Account for endzones + area between yard lines
      return 16 + 8 * (this.yardLines.length - 1) + 16;
    },
    fieldHeight(): number {
      return this.hashMarks[1] + this.hashMarks[0];
    },
    dashedLinesVertical(): number[] {
      const increments: number[] = [];
      for (let x = 4; x < this.fieldWidth; x += 4) {
        increments.push(x);
      }
      return increments;
    },
    dashedLinesHorizontal(): number[] {
      const increments: number[] = [];
      for (let y = 4; y < this.fieldHeight; y += 4) {
        increments.push(y);
      }
      return increments;
    },
    /**
     * @return [x offset, yard line number]
     */
    yardLineNumbers(): [number, string][] {
      const retVal: [number, string][] = [];
      let lineNumber: number = 1;
      for (let lineIndex = 2; lineIndex < this.yardLines.length / 2; lineIndex += 2) {
        retVal.push([this.yardLines[lineIndex], `${lineNumber.toString()} 0`]);
        const oppositeLineIndex = this.yardLines.length - 1 - lineIndex;
        if (oppositeLineIndex !== lineIndex) {
          retVal.push([this.yardLines[oppositeLineIndex], `${lineNumber.toString()} 0`]);
        }
        lineNumber += 1;
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
  width: 100%;
  height: 100%;
  background: burlywood;
}
</style>
