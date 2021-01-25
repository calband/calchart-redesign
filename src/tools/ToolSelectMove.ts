import BaseTool from "./BaseTool";
import BaseMoveTool from "./BaseMoveTool";
import { GlobalStore } from "@/store";
import StuntSheetDot from "@/models/StuntSheetDot";
import { InsideLasso } from "@/models/util/Lasso";
import { Mutations } from "@/store/mutations";
import { filter } from "vue/types/umd";

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

  supportsSelection = true;

  onMouseDownInternal(event: MouseEvent): void {
    const [x, y] = BaseTool.convertClientCoordinates(event);
    const existingDot = BaseTool.findDotAtEvent(event);

    // reset what we are doing
    this.moveToolStart = null;
    this.selectionLassoStart = null;

    if (existingDot) {
      // if we click on a selected dot, determine if we are toggling selection.
      if (GlobalStore.state.selectedDotIds.includes(existingDot.id)) {
        if (event.altKey) {
          GlobalStore.commit(Mutations.TOGGLE_SELECTED_DOTS, [existingDot.id]);
        }
      } else {
        if (!event.shiftKey) {
          GlobalStore.commit(Mutations.CLEAR_SELECTED_DOTS);
        }
        if (event.altKey) {
          GlobalStore.commit(Mutations.TOGGLE_SELECTED_DOTS, [existingDot.id]);
        } else {
          GlobalStore.commit(Mutations.ADD_SELECTED_DOTS, [existingDot.id]);
        }
      }
      this.moveToolStart = [x, y];
      this.doGrapherToolMoveAction([x, y]);
    } else {
      // if we hvae not clicked on a dot, start a new selection.
      if (!event.shiftKey) {
        GlobalStore.commit(Mutations.CLEAR_SELECTED_DOTS);
      }
      GlobalStore.commit(Mutations.SET_SELECTION_LASSO, [[x, y]]);
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
      const newPositions: [number, [number, number]][] = [];
      GlobalStore.state.selectedDotIds.forEach((id: number) => {
        const selectedDot = currentSSDots.find((dot) => dot.id === id);
        if (!selectedDot) {
          return;
        }
        const [roundedX, roundedY] = BaseTool.roundCoordinateToGrid([
          selectedDot.x + deltaX,
          selectedDot.y + deltaY,
        ]);
        newPositions.push([id, [roundedX, roundedY]]);
      });
      GlobalStore.commit(Mutations.MOVE_DOTS, newPositions);
      // Set the ToolDots to be empty to indicate we're not moving anymore.
      GlobalStore.commit(Mutations.SET_GRAPHER_TOOL_DOTS, []);
      // null out moveToolStart to incidcate we're not moving anymore.
      this.moveToolStart = null;
      return;
    }
    if (this.selectionLassoStart !== null) {
      // Complete the selection by finding everything in the selection box.
      const stuntSheetDots: StuntSheetDot[] =
        GlobalStore.getters.getSelectedStuntSheet.stuntSheetDots;
      const dotsInLasso = stuntSheetDots.filter((dot) =>
        InsideLasso(GlobalStore.state.selectionLasso, [dot.x, dot.y])
      );
      const dotIdsInLasso = dotsInLasso.map((dot) => dot.id);
      if (event.altKey) {
        GlobalStore.commit(Mutations.TOGGLE_SELECTED_DOTS, dotIdsInLasso);
      } else {
        GlobalStore.commit(Mutations.ADD_SELECTED_DOTS, dotIdsInLasso);
      }
      // we are done selecting, so clear out the box
      GlobalStore.commit(Mutations.SET_SELECTION_LASSO, []);
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
    const grapherToolDots: StuntSheetDot[] = [];
    GlobalStore.state.selectedDotIds.forEach((id: number) => {
      const selectedDot = currentSSDots.find((dot) => dot.id === id);
      if (!selectedDot) {
        return;
      }
      const [roundedX, roundedY] = BaseTool.roundCoordinateToGrid([
        selectedDot.x + deltaX,
        selectedDot.y + deltaY,
      ]);
      grapherToolDots.push(
        new StuntSheetDot({
          ...selectedDot,
          x: roundedX,
          y: roundedY,
        })
      );
    });
    GlobalStore.commit(Mutations.SET_GRAPHER_TOOL_DOTS, grapherToolDots);
  }

  // override this function change the selection lasso.
  abstract onNewMouseMoveSelection(point: [number, number]): void;
}
