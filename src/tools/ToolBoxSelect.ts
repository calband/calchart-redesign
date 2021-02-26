import { ToolConstructor } from "./BaseTool";
import { ToolSelectMove } from "./ToolSelectMove";
import { GlobalStore } from "@/store";
import { Mutations } from "@/store/mutations";

/**
 * Enables Selection, Moving, and Panning via base class
 * This Tool creates a rectangle as a lasso.
 */
const ToolBoxSelect: ToolConstructor = class ToolBoxSelect extends ToolSelectMove {
  onNewMouseMoveSelection(point: [number, number]): void {
    if (this.selectionLassoStart === null) {
      return;
    }
    GlobalStore.commit(Mutations.SET_SELECTION_LASSO, [
      [this.selectionLassoStart[0], this.selectionLassoStart[1]],
      [point[0], this.selectionLassoStart[1]],
      [point[0], point[1]],
      [this.selectionLassoStart[0], point[1]],
      [this.selectionLassoStart[0], this.selectionLassoStart[1]],
    ]);
  }
};

export default ToolBoxSelect;
