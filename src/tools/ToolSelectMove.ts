import BaseTool from "./BaseTool";
import BaseMoveTool from "./BaseMoveTool";
import { GlobalStore } from "@/store";
import StuntSheetDot from "@/models/StuntSheetDot";
import { InsideLasso } from "@/models/util/Lasso";

/**
 * Enables Selection and Moving.
 * Selections are additive with the shift key, and toggle with the option/alt key.
 * If a dot targeted on mouse down, that treats it as a selection, and transition to mouse move.
 * If a dot is not targeted on mouse down, that starts a new selection.  Subclass this to create box or lasso selectors.
 * If doing a mouse move, translate all the dots by the amount we've moved.
 */
export abstract class ToolSelectMove extends BaseMoveTool {
  private moveToolStart: [number, number] | null = null;
  protected selectionLassoStart: [number, number] | null = null;

  onMouseDownInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinates(event);
    const existingDotIndex = BaseTool.findDotAtEvent(event);

    // reset what we are doing
    this.moveToolStart = null;
    this.selectionLassoStart = null;

    if (existingDotIndex !== -1) {
      // if we click on a selected dot, determine if we are toggling selection.
      if (GlobalStore.state.selectedDots.includes(existingDotIndex)) {
        if (event.altKey) {
          GlobalStore.commit("toggleSelectedDots", [existingDotIndex]);
        }
      } else {
        if (!event.shiftKey) {
          GlobalStore.commit("clearSelectedDots");
        }
        if (event.altKey) {
          GlobalStore.commit("toggleSelectedDots", [existingDotIndex]);
        } else {
          GlobalStore.commit("addSelectedDots", [existingDotIndex]);
        }
      }
      this.moveToolStart = [x, y];
      this.doGrapherToolMoveAction([x, y]);
    } else {
      // if we hvae not clicked on a dot, start a new selection.
      if (!event.shiftKey) {
        GlobalStore.commit("clearSelectedDots");
      }
      GlobalStore.commit("setSelectionLasso", [[x, y]]);
      this.selectionLassoStart = [x, y];
    }
  }

  onMouseUpInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinates(event);

    if (this.moveToolStart !== null) {
      // We are in a Move, so translate all the dots.
      const [deltaX, deltaY] = [
        x - this.moveToolStart[0],
        y - this.moveToolStart[1],
      ];
      const currentSSDots: StuntSheetDot[] =
        GlobalStore.getters.getSelectedStuntSheet.stuntSheetDots;
      GlobalStore.state.selectedDots.forEach((index: number) => {
        const [roundedX, roundedY] = BaseTool.roundCoordinateToGrid([
          currentSSDots[index].x + deltaX,
          currentSSDots[index].y + deltaY,
        ]);
        GlobalStore.commit("moveDot", {
          index: index,
          position: [roundedX, roundedY],
        });
      });
      // Set the ToolDots to be empty to indicate we're not moving anymore.
      GlobalStore.commit("setGrapherToolDots", []);
      // null out moveToolStart to incidcate we're not moving anymore.
      this.moveToolStart = null;
      return;
    }
    if (this.selectionLassoStart !== null) {
      // Complete the selection by finding everything in the selection box.
      const stuntSheetDots: StuntSheetDot[] =
        GlobalStore.getters.getSelectedStuntSheet.stuntSheetDots;
      const newArray = stuntSheetDots.filter((dot) =>
        InsideLasso(GlobalStore.state.selectionLasso, [dot.x, dot.y])
      );
      const newIndices = newArray.map((dot) =>
        stuntSheetDots.findIndex((dot2): boolean => {
          return dot.x === dot2.x && dot.y === dot2.y;
        })
      );
      if (event.altKey) {
        GlobalStore.commit("toggleSelectedDots", newIndices);
      } else {
        GlobalStore.commit("addSelectedDots", newIndices);
      }
      // we are done selecting, so clear out the box
      GlobalStore.commit("setSelectionLasso", []);
      this.selectionLassoStart = null;
    }
  }

  onMouseMoveInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinates(event);
    if (this.moveToolStart !== null) {
      this.doGrapherToolMoveAction([x, y]);
      return;
    }
    if (this.selectionLassoStart !== null) {
      this.onNewMouseMoveSelection([x, y]);
    }
  }

  private doGrapherToolMoveAction(point: [number, number]): void {
    // We are in a Move, so translate all the dots.
    if (this.moveToolStart === null) {
      return;
    }
    const [deltaX, deltaY] = [
      point[0] - this.moveToolStart[0],
      point[1] - this.moveToolStart[1],
    ];
    const currentSSDots: StuntSheetDot[] =
      GlobalStore.getters.getSelectedStuntSheet.stuntSheetDots;
    GlobalStore.commit(
      "setGrapherToolDots",
      GlobalStore.state.selectedDots.map((index: number) => {
        const [roundedX, roundedY] = BaseTool.roundCoordinateToGrid([
          currentSSDots[index].x + deltaX,
          currentSSDots[index].y + deltaY,
        ]);
        return currentSSDots !== null && index < currentSSDots.length
          ? {
              x: roundedX,
              y: roundedY,
              dotLabelIndex: currentSSDots[index].dotLabelIndex,
            }
          : {};
      })
    );
  }

  // override this function change the selection lasso.
  abstract onNewMouseMoveSelection(point: [number, number]): void;
}
