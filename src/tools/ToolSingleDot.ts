import BaseTool, { ToolConstructor } from './BaseTool';
import { Store } from 'vuex';
import { CalChartState } from '@/store';
import StuntSheetDot from '@/models/StuntSheetDot';
import StuntSheet from '@/models/StuntSheet';

/**
 * Add or remove a single dot on click.
 */
const ToolSingleDot: ToolConstructor = class ToolSingleDot extends BaseTool {
  onClick(event: MouseEvent, store: Store<CalChartState>): void {
    const [x, y] = BaseTool.convertClientCoordinates(event, store);
    const stuntSheet: StuntSheet = store.getters.getSelectedStuntSheet;
    const existingDotIndex = stuntSheet.stuntSheetDots
      .findIndex((dot: StuntSheetDot): boolean => {
        return x === dot.x && y === dot.y;
      });
    if (existingDotIndex !== -1) {
      store.commit('removeDot', existingDotIndex);
    } else {
      store.commit('addDot', new StuntSheetDot({ x, y }));
    }
  }

  onMouseover(event: MouseEvent, store: Store<CalChartState>): void {
    const [x, y] = BaseTool.convertClientCoordinates(event, store);
    store.commit('setGrapherToolDots', [new StuntSheetDot({ x, y })]);
  }
};

export default ToolSingleDot;
