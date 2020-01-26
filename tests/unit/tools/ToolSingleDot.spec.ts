import ToolSingleDot from '@/tools/ToolSingleDot';
import { generateStore, CalChartState } from '@/store';
import { Store } from 'vuex';
import BaseTool from '@/tools/BaseTool';
import StuntSheetDot from '@/models/StuntSheetDot';

describe('tools/ToolSingleDot', () => {
  let store: Store<CalChartState>;
  let tool: BaseTool;

  beforeEach(() => {
    BaseTool.convertClientCoordinates = jest.fn().mockReturnValue([0, 2]);
    store = generateStore();
    Object.defineProperty(store, 'commit', { value: jest.fn() });
    tool = new ToolSingleDot(store);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('onClick', () => {
    it('adds a new dot if none exists in the spot', () => {
      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled();
      expect(store.commit).not.toHaveBeenCalled();

      tool.onClick(new MouseEvent('click', { clientX: 0, clientY: 0 }), store);

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled();
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit)
        .toHaveBeenCalledWith('addDot', expect.any(StuntSheetDot));
    });

    it('removes a dot if it exists in the spot', () => {
      const stuntSheet = store.state.show.stuntSheets[store.state.selectedSS];
      stuntSheet.stuntSheetDots.push(new StuntSheetDot({ x: 0, y: 2 }));

      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled();
      expect(store.commit).not.toHaveBeenCalled();

      tool.onClick(new MouseEvent('click', { clientX: 0, clientY: 2 }), store);

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled();
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith('removeDot', 0);
    });
  });

  describe('onMousemove', () => {
    it('sets grapher tool dot', () => {
      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled();
      expect(store.commit).not.toHaveBeenCalled();

      tool.onMousemove(
        new MouseEvent('mousemove', { clientX: 0, clientY: 2 }),
        store
      );

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled();
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        'setGrapherToolDots',
        expect.anything()
      );
      const grapherToolDots: StuntSheetDot[]
        = (store.commit as jest.Mock).mock.calls[0][1];
      expect(grapherToolDots).toHaveLength(1);
      expect(grapherToolDots[0].x).toBe(0);
      expect(grapherToolDots[0].y).toBe(2);
    });
  });
});
