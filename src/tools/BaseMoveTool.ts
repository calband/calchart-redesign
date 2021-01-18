import { GlobalStore } from "@/store";
import BaseTool from "./BaseTool";

/**
 * BaseMoveTool handles the basics of panning the field when meta/alt key is
 * pressed.  Derived tools implement onMouseDown/Up/Move to do tool specific
 * actions.
 */
export default abstract class BaseMoveTool extends BaseTool {
  static enablePan(enable: boolean): void {
    const grapherSvgPanZoom: SvgPanZoom.Instance | undefined =
      GlobalStore.state.grapherSvgPanZoom;
    if (grapherSvgPanZoom === undefined) {
      throw new Error("There is no grapher pan zoom instance");
    }
    if (enable) {
      grapherSvgPanZoom.enablePan();
    } else {
      grapherSvgPanZoom.disablePan();
    }
  }

  /**
   * onMouseDown:  Enabling panning if meta/ctrl key is pressed, otherwise call
   * out to the subclass to determine the action to take on mouse down.
   */
  onMouseDown(event: MouseEvent): void {
    if (event.metaKey || event.ctrlKey) {
      BaseMoveTool.enablePan(true);
      return;
    }
    BaseMoveTool.enablePan(false);

    BaseTool.updateInvertedCTMMatrix();
    this.onMouseDownInternal(event);
  }

  onMouseUp(event: MouseEvent): void {
    BaseTool.updateInvertedCTMMatrix();
    this.onMouseUpInternal(event);
  }

  onMouseMove(event: MouseEvent): void {
    BaseTool.updateInvertedCTMMatrix();
    this.onMouseMoveInternal(event);
  }

  // override these functions in the extended classes
  /* eslint-disable @typescript-eslint/no-unused-vars,
    @typescript-eslint/no-empty-function */
  onMouseDownInternal(event: MouseEvent): void {}

  onMouseUpInternal(event: MouseEvent): void {}

  onMouseMoveInternal(event: MouseEvent): void {}
  /* eslint-enable @typescript-eslint/no-unused-vars,
    @typescript-eslint/no-empty-function */

  supportsSelection = false;
}
