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
    const existingDotIndex = BaseTool.findDotAtEvent(event);
    if (existingDotIndex !== -1) {
      GlobalStore.commit("removeDot", existingDotIndex);
    } else {
      GlobalStore.commit("addDot", new StuntSheetDot({ x, y }));
    }
  }

  onMouseMoveInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    GlobalStore.commit("setGrapherToolDots", [new StuntSheetDot({ x, y })]);
  }
};

export default ToolSingleDot;
