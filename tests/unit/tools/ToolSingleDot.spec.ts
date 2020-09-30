import ToolSingleDot from '@/tools/ToolSingleDot'
import { GlobalStore } from '@/store'
import BaseTool from '@/tools/BaseTool'
import StuntSheetDot from '@/models/StuntSheetDot'

describe('tools/ToolSingleDot', () => {
  let tool: BaseTool

  beforeEach(() => {
    BaseTool.convertClientCoordinates = jest.fn().mockReturnValue([0, 2])
    Object.defineProperty(GlobalStore, 'commit', { value: jest.fn() })
    tool = new ToolSingleDot()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('onClick', () => {
    it('adds a new dot if none exists in the spot', () => {
      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled()
      expect(GlobalStore.commit).not.toHaveBeenCalled()

      tool.onClick(new MouseEvent('click', { clientX: 0, clientY: 0 }))

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled()
      expect(GlobalStore.commit).toHaveBeenCalledTimes(1)
      expect(GlobalStore.commit)
        .toHaveBeenCalledWith('addDot', expect.any(StuntSheetDot))
    })

    it('removes a dot if it exists in the spot', () => {
      const stuntSheet = GlobalStore.getters.getSelectedStuntSheet
      stuntSheet.stuntSheetDots.push(new StuntSheetDot({ x: 0, y: 2 }))

      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled()
      expect(GlobalStore.commit).not.toHaveBeenCalled()

      tool.onClick(new MouseEvent('click', { clientX: 0, clientY: 2 }))

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled()
      expect(GlobalStore.commit).toHaveBeenCalledTimes(1)
      expect(GlobalStore.commit).toHaveBeenCalledWith('removeDot', 0)
    })
  })

  describe('onMousemove', () => {
    it('sets grapher tool dot', () => {
      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled()
      expect(GlobalStore.commit).not.toHaveBeenCalled()

      tool.onMousemove(new MouseEvent(
        'mousemove',
        { clientX: 0, clientY: 2 }
      ))

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled()
      expect(GlobalStore.commit).toHaveBeenCalledTimes(1)
      expect(GlobalStore.commit).toHaveBeenCalledWith(
        'setGrapherToolDots',
        expect.anything()
      )
      const grapherToolDots: StuntSheetDot[] =
        (GlobalStore.commit as jest.Mock).mock.calls[0][1]
      expect(grapherToolDots).toHaveLength(1)
      expect(grapherToolDots[0].x).toBe(0)
      expect(grapherToolDots[0].y).toBe(2)
    })
  })
})
