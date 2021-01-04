import { ToolConstructor, TOOL_IDS } from "./BaseTool";
import { ToolSelectMove } from "./ToolSelectMove";
import { GlobalStore } from "@/store";
import { SET_SELECTION_LASSO } from "@/store/mutations";

/**
 * Enables Selection, Moving, and Panning via base class
 * This Tool creates a rectangle as a lasso.
 */
const ToolBoxSelect: ToolConstructor = class ToolBoxSelect extends ToolSelectMove {
  readonly toolId: TOOL_IDS = TOOL_IDS.BOX_SELECT;

  onNewMouseMoveSelection(point: [number, number]): void {
    if (this.selectionLassoStart === null) {
      return;
    }
    GlobalStore.commit(SET_SELECTION_LASSO, [
      [this.selectionLassoStart[0], this.selectionLassoStart[1]],
      [point[0], this.selectionLassoStart[1]],
      [point[0], point[1]],
      [this.selectionLassoStart[0], point[1]],
      [this.selectionLassoStart[0], this.selectionLassoStart[1]],
    ]);
  }
};

export default ToolBoxSelect;
