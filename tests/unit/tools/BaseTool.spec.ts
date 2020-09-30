import BaseTool from "@/tools/BaseTool";
import { GlobalStore } from "@/store";

describe("tools/BaseTool", () => {
  let matrixTransformMock: jest.Mock;
  let createSVGPointMock: jest.Mock;
  let getElementsByClassNameMock: jest.Mock;

  beforeAll(() => {
    // Mock out inverse matrix calculations
    matrixTransformMock = jest.fn().mockReturnValue({
      x: 1.5,
      y: 0.5,
    });
    createSVGPointMock = jest.fn().mockReturnValue({
      matrixTransform: matrixTransformMock,
    });
    getElementsByClassNameMock = jest.fn().mockReturnValue([
      {
        createSVGPoint: createSVGPointMock,
      },
    ]);
    Object.defineProperty(document, "getElementsByClassName", {
      configurable: true,
      value: getElementsByClassNameMock,
    });

    GlobalStore.state.invertedCTMMatrix = {} as DOMMatrix;
  });

  it("convertClientCoordinates calls the correct functions", () => {
    const [x, y] = BaseTool.convertClientCoordinates(
      new MouseEvent("click", { clientX: 0, clientY: 0 })
    );

    expect(getElementsByClassNameMock).toHaveBeenCalled();
    expect(createSVGPointMock).toHaveBeenCalled();
    expect(matrixTransformMock).toHaveBeenCalled();
    expect(matrixTransformMock).toHaveBeenCalledWith(
      GlobalStore.state.invertedCTMMatrix
    );

    expect(x).toBe(2);
    expect(y).toBe(0);
  });

  describe("roundCoordinateToGrid", () => {
    it.each([
      [0.5, 0],
      [1.1, 2],
      [3.0, 4],
      [-1.5, -2],
    ])("%f rounds to %i", (input, output) => {
      expect(BaseTool.roundCoordinateToGrid(input)).toBe(output);
    });
  });
});
