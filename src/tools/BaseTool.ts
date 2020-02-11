import { GlobalStore } from '@/store';

/* eslint-disable max-len */
/**
 * Defines the functionality of a tool to be used in the Bottom Menu.
 * Methods are event handlers for the svg in Grapher.
 *
 * For the conversion of clientX/Y to svg x/y, see the following resources:
 * - https://css-tricks.com/creating-a-panning-effect-for-svg/#conclusion
 * - https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
 */
/* eslint-enable max-len */
export default abstract class BaseTool {
  /**
   * Approximates coordinate on the two step grid
   *
   * @param coordinate - Either the x or y coordinate
   */
  static roundCoordinateToGrid(coordinate: number): number {
    return Math.round(coordinate / 2) * 2;
  }

  /**
   * Convert clientX/Y to the X/Y coordinates on the SVG rectangle.
   **/
  static convertClientCoordinates(event: MouseEvent): [number, number] {
    const svg = document.getElementsByTagName('svg')[0];
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const invertedCTMMatrix = GlobalStore.state.invertedCTMMatrix;
    if (invertedCTMMatrix === undefined) {
      throw 'No inverted ctm matrix';
    }
    const convertedPoint = point.matrixTransform(invertedCTMMatrix);

    return [
      BaseTool.roundCoordinateToGrid(convertedPoint.x),
      BaseTool.roundCoordinateToGrid(convertedPoint.y),
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick(event: MouseEvent): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMousemove(event: MouseEvent): void {}
}

export interface ToolConstructor {
  new (): BaseTool;
}
