<template>
  <div class="menu-bottom">
    <div class="buttons">
      <b-tooltip
        v-for="(toolData, index) in toolDataList"
        :key="`${toolData.icon}-toolData`"
        :label="toolData.label"
        data-test="menu-bottom--tooltip"
      >
        <b-button
          :type="toolSelectedIndex === index ? 'is-primary' : 'is-light'"
          :icon-left="toolData.icon"
          :data-test="`menu-bottom-tool--${toolData['data-test']}`"
          @click="setTool(index)"
        />
      </b-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * Handles setting and modifying the tools used in Grapher
 */
import Vue from 'vue'
import BaseTool, { ToolConstructor } from '@/tools/BaseTool'
import ToolPanZoom from '@/tools/ToolPanZoom'
import ToolSingleDot from '@/tools/ToolSingleDot'

interface ToolData {
  label: string;
  icon: string;
  tool: ToolConstructor;
  'data-test': string;
}

export default Vue.extend({
  name: 'MenuBottom',
  data: (): {
    toolDataList: ToolData[];
    toolSelectedIndex: number;
    temporaryTool: BaseTool | null;
  } => ({
    toolDataList: [
      {
        label: 'Pan and Zoom (Hold Ctrl/Meta to turn on)',
        icon: 'hand-right',
        tool: ToolPanZoom,
        'data-test': 'pan-zoom'
      },
      {
        label: 'Add and Remove Single Dot',
        icon: 'plus-minus',
        tool: ToolSingleDot,
        'data-test': 'add-rm'
      }
    ],
    toolSelectedIndex: 0, // Assume that 0 is the pan/zoom tool
    temporaryTool: null // Used to hold last tool when ctrl/meta is held
  }),
  watch: {
    toolSelectedIndex (newIndex: number, oldIndex: number): void {
      /**
       * Calculate inverted CTM matrix that is used to convert ClientX/Y to
       * X/Y of the SVG
       */
      const wrapper = document
        .getElementsByClassName('grapher--wrapper')[0] as SVGGElement
      const ctm = wrapper.getScreenCTM()
      if (!ctm) {
        throw new Error('Unable to retrieve wrapper CTM')
      }
      const invertedMatrix = ctm.inverse()
      this.$store.commit('setInvertedCTMMatrix', invertedMatrix)

      // Enable or disable pan/zoom depending on tool selected
      // eslint-disable-next-line no-undef
      const grapherSvgPanZoom: SvgPanZoom.Instance | undefined =
        this.$store.state.grapherSvgPanZoom
      if (grapherSvgPanZoom === undefined) {
        throw new Error('There is no grapher pan zoom instance')
      }

      if (newIndex === 0 && oldIndex !== 0) {
        grapherSvgPanZoom.enablePan()
        grapherSvgPanZoom.enableZoom()
        grapherSvgPanZoom.enableControlIcons()
      } else if (oldIndex === 0 && newIndex !== 0) {
        grapherSvgPanZoom.disablePan()
        grapherSvgPanZoom.disableZoom()
        grapherSvgPanZoom.disableControlIcons()
      }
    }
  },
  mounted () {
    this.setTool(this.$data.toolSelectedIndex)

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  },
  methods: {
    setTool (toolIndex: number): void {
      this.$data.toolSelectedIndex = toolIndex
      const ToolConstructor: ToolConstructor =
        this.$data.toolDataList[toolIndex].tool
      const tool: BaseTool = new ToolConstructor()
      this.$store.commit('setToolSelected', tool)
    },
    isCtrl (event: KeyboardEvent): boolean {
      /**
       * Capture both Ctrl and Meta key (Cmd on Mac or Windows logo key)
       * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
       * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
       */
      return event.key === 'Control' ||
        event.key === 'Meta' ||
        event.keyCode === 17 ||
        event.keyCode === 91
    },
    onKeyDown (event: KeyboardEvent): void {
      if (event.repeat || !this.isCtrl(event)) return

      this.$data.temporaryTool = this.$store.state.toolSelected
      this.setTool(0)
    },
    onKeyUp (event: KeyboardEvent): void {
      if (!this.isCtrl(event) || this.$data.temporaryTool === null) return

      // We do not use this.setTool to avoid reinitializing the previous tool
      const temporaryTool: BaseTool = this.$data.temporaryTool
      this.$store.commit('setToolSelected', temporaryTool)
      this.$data.toolSelectedIndex =
        this.$data.toolDataList.findIndex((toolData: ToolData): boolean => {
          return toolData.tool === temporaryTool.constructor
        })
      this.$data.temporaryTool = null
    }
  }
})
</script>

<style scoped lang="scss">

</style>
