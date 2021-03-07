import { GlobalStore } from "@/store";
import StuntSheetDot from "@/models/StuntSheetDot";

/**
 * Defines the functionality of a tool to be used in the Bottom Menu.
 * Methods are event handlers for the svg in Grapher.
 *
 * For the conversion of clientX/Y to svg x/y, see the following resources:
 * - https://css-tricks.com/creating-a-panning-effect-for-svg/#conclusion
 * - https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
 */
export default abstract class BaseTool {
  /**
   * Approximates coordinate on the two step grid
   *
   * @param coordinate - Either the x or y coordinate
   */
  static roundCoordinateToGrid(coordinate: [number, number]): [number, number] {
    return [
      Math.round(coordinate[0] / 2) * 2,
      Math.round(coordinate[1] / 2) * 2,
    ];
  }

  /**
   * Convert clientX/Y to the X/Y coordinates on the SVG rectangle.
   **/
  static convertClientCoordinates(event: MouseEvent): [number, number] {
    const svg = document.getElementsByClassName(
      "grapher--svg"
    )[0] as SVGSVGElement;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const invertedCTMMatrix = GlobalStore.state.invertedCTMMatrix;
    if (invertedCTMMatrix === undefined) {
      throw new Error("No inverted ctm matrix");
    }
    const convertedPoint = point.matrixTransform(invertedCTMMatrix);

    return [convertedPoint.x, convertedPoint.y];
  }

  /**
   * Convert clientX/Y to the X/Y coordinates on the SVG rectangle.
   **/
  static convertClientCoordinatesRounded(event: MouseEvent): [number, number] {
    const point: [number, number] = BaseTool.convertClientCoordinates(event);
    return BaseTool.roundCoordinateToGrid(point);
  }

  /**
   * returns dot at mouse event, or undefined if nothing found
   **/
  static findDotAtEvent(event: MouseEvent): StuntSheetDot | undefined {
    const [x, y] = BaseTool.convertClientCoordinatesRounded(event);
    const stuntSheetDots: StuntSheetDot[] =
      GlobalStore.getters.getSelectedStuntSheet.stuntSheetDots;
    return stuntSheetDots.find((dot: StuntSheetDot): boolean => {
      return x === dot.x && y === dot.y;
    });
  }

  /**
   * Convert clientX/Y to the X/Y coordinates on the SVG rectangle.
   **/
  static updateInvertedCTMMatrix(): void {
    /**
     * Calculate inverted CTM matrix that is used to convert ClientX/Y to
     * X/Y of the SVG
     */
    const wrapper = document.getElementsByClassName(
      "grapher--wrapper"
    )[0] as SVGGElement;
    const ctm = wrapper.getScreenCTM();
    if (!ctm) {
      throw new Error("Unable to retrieve wrapper CTM");
    }
    GlobalStore.commit("setInvertedCTMMatrix", ctm.inverse());
  }

  abstract onMouseDown(event: MouseEvent): void;
  abstract onMouseUp(event: MouseEvent): void;
  abstract onMouseMove(event: MouseEvent): void;

  // does the tool support selections
  abstract readonly supportsSelection: boolean;
}

export interface ToolConstructor {
  new (): BaseTool;
}
