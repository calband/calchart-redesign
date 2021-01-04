import { ToolConstructor, TOOL_IDS } from "./BaseTool";
import { ToolSelectMove } from "./ToolSelectMove";
import { GlobalStore } from "@/store";
import { SET_TOOL_SELECTED } from "@/store/mutations";

/**
 * Enables Selection, Moving, and Panning via base class
 * This Tool creates an arbitrary path as a lasso.
 */
const ToolLassoSelect: ToolConstructor = class ToolLassoSelect extends ToolSelectMove {
  readonly toolId: TOOL_IDS = TOOL_IDS.LASSO_SELECT;

  onNewMouseMoveSelection(point: [number, number]): void {
    if (this.selectionLassoStart === null) {
      return;
    }
    const arrayCopy = GlobalStore.state.selectionLasso;
    arrayCopy.push(point);
    GlobalStore.commit(SET_TOOL_SELECTED, arrayCopy);
  }
};

export default ToolLassoSelect;
