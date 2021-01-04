import BaseMoveTool from "./BaseMoveTool";
import BaseTool, { ToolConstructor } from "./BaseTool";
import { GlobalStore } from "@/store";
import StuntSheetDot from "@/models/StuntSheetDot";

/**
 * Add or remove a single dot on click.
 */
const ToolSingleDot: ToolConstructor = class ToolSingleDot extends BaseMoveTool {
  onMouseDownInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    const existingDot = BaseTool.findDotAtEvent(event);
    if (existingDot) {
      GlobalStore.commit("removeDot", existingDot.id);
    } else {
      GlobalStore.commit("addDot", { x, y });
    }
  }

  onMouseMoveInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    GlobalStore.commit("setGrapherToolDots", [
      new StuntSheetDot({ x, y, id: -1 }),
    ]);
  }
};

export default ToolSingleDot;
