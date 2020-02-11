import BaseTool from '@/tools/BaseTool';
import { GlobalStore } from '@/store';

describe('tools/BaseTool', () => {
  let matrixTransformMock: jest.Mock;
  let createSVGPointMock: jest.Mock;
  let getElementsByTagNameMock: jest.Mock;

  beforeAll(() => {
    // Mock out inverse matrix calculations
    matrixTransformMock = jest.fn().mockReturnValue({
      x: 1.5,
      y: 0.5,
    });
    createSVGPointMock = jest.fn().mockReturnValue({
      matrixTransform: matrixTransformMock,
    });
    getElementsByTagNameMock = jest.fn().mockReturnValue([{
      createSVGPoint: createSVGPointMock,
    }]);
    Object.defineProperty(document, 'getElementsByTagName', {
      configurable: true,
      value: getElementsByTagNameMock,
    });

    GlobalStore.state.invertedCTMMatrix = new Object() as DOMMatrix;
  });

  it('convertClientCoordinates calls the correct functions', () => {
    const [x, y] = BaseTool.convertClientCoordinates(new MouseEvent(
      'click',
      { clientX: 0, clientY: 0 }
    ));

    expect(getElementsByTagNameMock).toHaveBeenCalled();
    expect(createSVGPointMock).toHaveBeenCalled();
    expect(matrixTransformMock).toHaveBeenCalled();
    expect(matrixTransformMock)
      .toHaveBeenCalledWith(GlobalStore.state.invertedCTMMatrix);

    expect(x).toBe(2);
    expect(y).toBe(0);
  });

  describe('roundCoordinateToGrid', () => {
    it('0.5 goes to 0', () => {
      expect(BaseTool.roundCoordinateToGrid(0.5)).toBe(0);
    });

    it('1.1 rounds to 2', () => {
      expect(BaseTool.roundCoordinateToGrid(1.1)).toBe(2);
    });

    it('3.0 rounds to 4', () => {
      expect(BaseTool.roundCoordinateToGrid(3.0)).toBe(4);
    });
  });
});
