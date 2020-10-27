<template>
  <div class="grapher">
    <svg
      class="grapher--svg"
      data-test="grapher--svg"
      @click.prevent="onClick"
      @mousemove="onMousemove"
    >
      <g class="grapher--wrapper" data-test="grapher--wrapper">
        <!-- Note:Inside svg, 1px = 1 eight-to-five step -->
        <rect
          class="grapher--field-rect"
          :width="fieldWidth"
          :height="fieldHeight"
          data-test="grapher--field-rect"
        />
        <g v-if="yardlines" class="grapher--line-container">
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
        <g class="grapher--line-container">
          <template v-for="offsetY in hashMarkOffsetsY">
            <line
              v-for="offsetX in yardLineOffsetsX"
              :key="offsetX + '-' + offsetY + '-hashMark'"
              :x1="offsetX - 0.75"
              :y1="offsetY"
              :x2="offsetX + 0.75"
              :y2="offsetY"
              data-test="grapher--hash-mark"
            />
          </template>
        </g>
        <g v-if="fourStepGrid" class="grapher--grid-container">
          <line
            v-for="offsetX in fourStepGridOffsetsX"
            :key="offsetX + '-vertical'"
            :x1="offsetX"
            y1="-0.125"
            :x2="offsetX"
            :y2="fieldHeight"
            data-test="grapher--grid-vertical"
          />
          <line
            v-for="offsetY in fourStepGridOffsetsY"
            :key="offsetY + '-horizontal'"
            x1="-0.125"
            :y1="offsetY"
            :x2="fieldWidth"
            :y2="offsetY"
            data-test="grapher--grid-horizontal"
          />
        </g>
        <g v-if="yardlineNumbers" class="grapher--number-container">
          <!-- Bottom of the yard line numbers is approximately 11 steps from
              the sideline -->
          <text
            v-for="numberAndOffsetX in yardLineNumberAndOffsetX"
            :key="`${numberAndOffsetX[1]}-yardNum`"
            :x="numberAndOffsetX[1]"
            :y="fieldHeight - 11"
            data-test="grapher--yard-number"
          >
            {{ numberAndOffsetX[0] }}
          </text>
          <text
            v-for="numberAndOffsetX in yardLineNumberAndOffsetX"
            :key="`${numberAndOffsetX[1]}-yardNumRotated`"
            :x="numberAndOffsetX[1]"
            :y="11"
            :transform="'rotate(180 ' + numberAndOffsetX[1] + ' 11)'"
            data-test="grapher--yard-number"
          >
            {{ numberAndOffsetX[0] }}
          </text>
        </g>
        <g class="grapher--dots-container">
          <circle
            v-for="dot in stuntSheetDots"
            :key="`${dot.x}-${dot.y}-dot`"
            class="grapher--dot"
            :cx="dot.xAtBeat(beat - 1)"
            :cy="dot.yAtBeat(beat - 1)"
            r="0.7"
            data-test="grapher--dot"
          />
        </g>
        <g v-if="showDotLabels" class="grapher--dotstext-container">
          <text
            v-for="(dot, index) in stuntSheetDots"
            :key="`${dot.x}-${dot.y}-dottext`"
            class="grapher--dottext"
            :x="dot.xAtBeat(beat - 1)"
            :y="dot.yAtBeat(beat - 1) - 1"
            data-test="grapher--dottext"
          >
            {{ dotLabels[index] }}
          </text>
        </g>
        <g class="grapher--tool-dots-container">
          <circle
            v-for="dot in grapherToolDots"
            :key="`${dot.x}-${dot.y}-tool-dot`"
            class="grapher--dot grapher--tool-dot"
            :cx="dot.x"
            :cy="dot.y"
            r="0.7"
            data-test="grapher--tool-dot"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import svgPanZoom from "svg-pan-zoom";
import BaseTool from "@/tools/BaseTool";
import StuntSheetDot from "@/models/StuntSheetDot";
import StuntSheet from "@/models/StuntSheet";

/**
 * Renders the field, the dots of the current stunt sheet, and pending dots
 * generated from the tool in use
 */
export default Vue.extend({
  name: "Grapher",
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
    showDotLabels(): boolean {
      return this.$store.state.showDotLabels;
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
    stuntSheetDots(): StuntSheetDot[] {
      const currentSS: StuntSheet = this.$store.getters.getSelectedStuntSheet;
      return currentSS.stuntSheetDots;
    },
    dotLabels(): string[] {
      const dotLabels = this.$store.getters.getDotLabels;
      const dots: StuntSheetDot[] = this.$store.getters.getSelectedStuntSheet
        .stuntSheetDots;
      return dots.map((dot, index) => {
        return dotLabels !== null &&
          dot.dotLabelIndex !== null &&
          dot.dotLabelIndex < dotLabels.length
          ? dotLabels[dot.dotLabelIndex]
          : index.toString();
      });
    },
    grapherToolDots(): StuntSheetDot[] {
      return this.$store.state.grapherToolDots;
    },
    beat: {
      get(): number {
        return this.$store.state.beat;
      },
    },
  },
  mounted() {
    const svgPanZoomInstance = svgPanZoom(".grapher--svg", {
      viewportSelector: ".grapher--wrapper",
      panEnabled: true,
      zoomEnabled: true,
      controlIconsEnabled: true,
      dblClickZoomEnabled: false,
    });
    this.$store.commit("setGrapherSvgPanZoom", svgPanZoomInstance);

    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    onResize(): void {
      this.$store.state.grapherSvgPanZoom.resize();
    },
    onClick(event: MouseEvent): void {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      toolSelected.onClick(event);
    },
    onMousemove(event: MouseEvent): void {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      toolSelected.onMousemove(event);
    },
  },
});
</script>

<style scoped lang="scss">
.grapher {
  grid-area: grapher;
  background: $stone-pine;
  position: relative;
}

.grapher--svg {
  width: 100%;
  height: 100%;
  // See PR#9
  position: absolute;
  top: 0;
  left: 0;
}

.grapher--line-container,
.grapher--field-rect {
  stroke: $white;
  stroke-width: 0.5;
}

.grapher--field-rect {
  fill: $soybean;
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

.grapher--dot {
  &.grapher--tool-dot {
    opacity: 0.5;
  }
}
.grapher--dottext {
  fill: $black;
  font-size: 2px;
  text-anchor: left;
  user-select: none;
}
</style>
