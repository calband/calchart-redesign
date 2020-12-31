import { ToolConstructor } from "./BaseTool";
import { ToolSelectMove } from "./ToolSelectMove";
import { GlobalStore } from "@/store";
import { Mutations } from "@/store/mutations";

/**
 * Enables Selection, Moving, and Panning via base class
 * This Tool creates an arbitrary path as a lasso.
 */
const ToolLassoSelect: ToolConstructor = class ToolLassoSelect extends ToolSelectMove {
  onNewMouseMoveSelection(point: [number, number]): void {
    if (this.selectionLassoStart === null) {
      return;
    }
    const arrayCopy = GlobalStore.state.selectionLasso;
    arrayCopy.push(point);
    GlobalStore.commit(Mutations.SET_TOOL_SELECTED, arrayCopy);
  }
};

export default ToolLassoSelect;
