import BaseMoveTool from "./BaseMoveTool";
import BaseTool, { ToolConstructor, TOOL_IDS } from "./BaseTool";
import { GlobalStore } from "@/store";
import StuntSheetDot from "@/models/StuntSheetDot";
import { ADD_DOTS, REMOVE_DOTS, SET_GRAPHER_TOOL_DOTS } from "@/store/mutations"

/**
 * Add or remove a single dot on click.
 */
const ToolSingleDot: ToolConstructor = class ToolSingleDot extends BaseMoveTool {
  readonly toolId: TOOL_IDS = TOOL_IDS.SINGLE_DOT;

  onMouseDownInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    const existingDotIndex = BaseTool.findDotAtEvent(event);
    if (existingDotIndex !== -1) {
      GlobalStore.commit(REMOVE_DOTS, [ existingDotIndex ]);
    } else {
      GlobalStore.commit(ADD_DOTS, [ { x, y } ]);
    }
  }

  onMouseMoveInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    GlobalStore.commit(SET_GRAPHER_TOOL_DOTS, [new StuntSheetDot({ x, y })]);
  }
};

export default ToolSingleDot;
