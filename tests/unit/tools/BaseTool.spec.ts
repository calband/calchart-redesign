import BaseTool from '@/tools/BaseTool';
import { generateStore, CalChartState } from '@/store';
import { Store } from 'vuex';

describe('tools/BaseTool', () => {
  let matrixTransformMock: jest.Mock;
  let createSVGPointMock: jest.Mock;
  let getElementsByTagNameMock: jest.Mock;
  let store: Store<CalChartState>;

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

    // Mock out store
    store = generateStore();
    store.commit('setInvertedCTMMatrix', {});
  });

  it('convertClientCoordinates calls the correct functions', () => {
    const [x, y] = BaseTool.convertClientCoordinates(
      new MouseEvent('click', { clientX: 0, clientY: 0 }),
      store,
    );

    expect(getElementsByTagNameMock).toHaveBeenCalled();
    expect(createSVGPointMock).toHaveBeenCalled();
    expect(matrixTransformMock).toHaveBeenCalled();
    expect(matrixTransformMock)
      .toHaveBeenCalledWith(store.state.invertedCTMMatrix);

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
