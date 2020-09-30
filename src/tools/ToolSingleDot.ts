import BaseTool, { ToolConstructor } from './BaseTool'
import { GlobalStore } from '@/store'
import StuntSheetDot from '@/models/StuntSheetDot'
import StuntSheet from '@/models/StuntSheet'

/**
 * Add or remove a single dot on click.
 */
const ToolSingleDot: ToolConstructor = class ToolSingleDot extends BaseTool {
  onClick (event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinates(event)
    const stuntSheet: StuntSheet = GlobalStore.getters.getSelectedStuntSheet
    const existingDotIndex = stuntSheet.stuntSheetDots
      .findIndex((dot: StuntSheetDot): boolean => {
        return x === dot.x && y === dot.y
      })
    if (existingDotIndex !== -1) {
      GlobalStore.commit('removeDot', existingDotIndex)
    } else {
      GlobalStore.commit('addDot', new StuntSheetDot({ x, y }))
    }
  }

  onMousemove (event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinates(event)
    GlobalStore.commit('setGrapherToolDots', [new StuntSheetDot({ x, y })])
  }
}

export default ToolSingleDot
