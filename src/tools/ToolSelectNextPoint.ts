import BaseTool from "./BaseTool";
import { GlobalStore } from "@/store";
import StuntSheetDot from "@/models/StuntSheetDot";
import StuntSheet from "@/models/StuntSheet";

/**
 * When in Set Next Point Mode, can set dots' dotLabelIndex and updates their flows
 *
 * @property currentSSDotIndex - The dot from the selected SS that has been clicked on
 */
export default class ToolSelectNextPoint extends BaseTool {
  onClick(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinates(event);

    const stuntSheet: StuntSheet =
      this.currentSSDotIndex === null
        ? GlobalStore.getters.getSelectedStuntSheet
        : GlobalStore.getters.getNextStuntSheet;
    const existingDotIndex = stuntSheet.stuntSheetDots.findIndex(
      (dot: StuntSheetDot): boolean => {
        return x === dot.x && y === dot.y;
      }
    );

    // Ignore if no dot found
    if (existingDotIndex === -1) {
      return;
    }

    if (this.currentSSDotIndex === null) {
      GlobalStore.commit("updateToolSelectedNextPoint", existingDotIndex);
    } else {
      GlobalStore.commit("syncDotLabelIndices", {
        currentSSDotIndex: this.currentSSDotIndex,
        nextSSDotIndex: existingDotIndex,
      });
    }
  }
}
