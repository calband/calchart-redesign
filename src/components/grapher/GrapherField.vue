<template>
  <g class="grapher-field" data-test="grapher-field">
    <rect
      class="grapher-field--rect"
      :width="fieldWidth"
      :height="fieldHeight"
      data-test="grapher-field--rect"
    />
    <g v-if="yardlines" class="grapher-field--line-container">
      <line
        v-for="offsetX in yardLineOffsetsX"
        :key="offsetX + '-yardLine'"
        :x1="offsetX"
        y1="0"
        :x2="offsetX"
        :y2="fieldHeight"
        data-test="grapher-field--yard-line"
      />
    </g>
    <g class="grapher-field--line-container">
      <template v-for="offsetY in hashMarkOffsetsY">
        <line
          v-for="offsetX in yardLineOffsetsX"
          :key="offsetX + '-' + offsetY + '-hashMark'"
          :x1="offsetX - 0.75"
          :y1="offsetY"
          :x2="offsetX + 0.75"
          :y2="offsetY"
          data-test="grapher-field--hash-mark"
        />
      </template>
    </g>
    <g v-if="fourStepGrid" class="grapher-field--grid-container">
      <line
        v-for="offsetX in fourStepGridOffsetsX"
        :key="offsetX + '-vertical'"
        :x1="offsetX"
        y1="-0.125"
        :x2="offsetX"
        :y2="fieldHeight"
        data-test="grapher-field--grid-vertical"
      />
      <line
        v-for="offsetY in fourStepGridOffsetsY"
        :key="offsetY + '-horizontal'"
        x1="-0.125"
        :y1="offsetY"
        :x2="fieldWidth"
        :y2="offsetY"
        data-test="grapher-field--grid-horizontal"
      />
    </g>
    <g v-if="yardlineNumbers" class="grapher-field--number-container">
      <!-- Bottom of the yard line numbers is approximately 11 steps from
          the sideline -->
      <text
        v-for="numberAndOffsetX in yardLineNumberAndOffsetX"
        :key="`${numberAndOffsetX[1]}-yardNum`"
        :x="numberAndOffsetX[1]"
        :y="fieldHeight - 11"
        data-test="grapher-field--yard-number"
      >
        {{ numberAndOffsetX[0] }}
      </text>
      <text
        v-for="numberAndOffsetX in yardLineNumberAndOffsetX"
        :key="`${numberAndOffsetX[1]}-yardNumRotated`"
        :x="numberAndOffsetX[1]"
        :y="11"
        :transform="'rotate(180 ' + numberAndOffsetX[1] + ' 11)'"
        data-test="grapher-field--yard-number"
      >
        {{ numberAndOffsetX[0] }}
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue";

/**
 * Renders the field.
 */
export default Vue.extend({
  name: "GrapherField",
  computed: {
    hashMarkOffsetsY(): [number, number] {
      return [
        this.$store.getters.getFrontHashOffsetY,
        this.$store.getters.getBackHashOffsetY,
      ];
    },
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
    fourStepGrid(): boolean {
      return this.$store.state.fourStepGrid;
    },
    yardlines(): boolean {
      return this.$store.state.yardlines;
    },
    yardlineNumbers(): boolean {
      return this.$store.state.yardlineNumbers;
    },
    fieldWidth(): number {
      // Account for endzones + area between yard lines
      return 16 + 8 * (this.yardLineOffsetsX.length - 1) + 16;
    },
    fieldHeight(): number {
      return (
        this.$store.getters.getBackHashOffsetY +
        this.$store.getters.getFrontHashOffsetY
      );
    },
    fourStepGridOffsetsX(): number[] {
      const offset: number = this.$store.state.yardlines ? 8 : 4;
      const retVal: number[] = [4, 8, this.fieldWidth - 8, this.fieldWidth - 4];
      for (
        let offsetX = 12;
        offsetX <= this.fieldWidth - 12;
        offsetX += offset
      ) {
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
      let yardLineNumber = 1;
      for (
        let lineIndex = 2;
        lineIndex < this.yardLineOffsetsX.length / 2;
        lineIndex += 2
      ) {
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
});
</script>

<style scoped lang="scss">
.grapher-field--line-container,
.grapher-field--rect {
  stroke: $white;
  stroke-width: 0.5;
}

.grapher-field--rect {
  fill: $soybean;
}

.grapher-field--grid-container {
  stroke: $white;
  stroke-width: 0.125;
  stroke-dasharray: 0.25 0.75;
}

.grapher-field--number-container {
  fill: $white;
  font-size: 4px;
  text-anchor: middle;
}
</style>
