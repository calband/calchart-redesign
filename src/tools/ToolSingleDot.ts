import BaseMoveTool from "./BaseMoveTool";
import BaseTool, { ToolConstructor } from "./BaseTool";
import { GlobalStore } from "@/store";
import StuntSheetDot from "@/models/StuntSheetDot";
import { Mutations } from "@/store/mutations";

/**
 * Add or remove a single dot on click.
 */
const ToolSingleDot: ToolConstructor = class ToolSingleDot extends BaseMoveTool {
  onMouseDownInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    const existingDot = BaseTool.findDotAtEvent(event);
    if (existingDot) {
      GlobalStore.commit(Mutations.REMOVE_DOTS, [ existingDot.id ]);
    } else {
      GlobalStore.commit(Mutations.ADD_DOTS, [{ x, y }]);
    }
  }

  onMouseMoveInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    GlobalStore.commit(Mutations.SET_GRAPHER_TOOL_DOTS, [
      new StuntSheetDot({ x, y, id: -1 }),
    ]);
  }
};

export default ToolSingleDot;
