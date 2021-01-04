import ToolSingleDot from "@/tools/ToolSingleDot";
import { GlobalStore } from "@/store";
import BaseTool from "@/tools/BaseTool";
import BaseMoveTool from "@/tools/BaseMoveTool";
import StuntSheetDot from "@/models/StuntSheetDot";
import { ADD_DOTS, REMOVE_DOTS } from "@/store/mutations";

describe("tools/ToolSingleDot", () => {
  let tool: BaseTool;

  beforeEach(() => {
    BaseTool.convertClientCoordinates = jest.fn().mockReturnValue([0, 2]);
    BaseTool.updateInvertedCTMMatrix = jest.fn();
    BaseMoveTool.enablePan = jest.fn();
    Object.defineProperty(GlobalStore, "commit", { value: jest.fn() });
    tool = new ToolSingleDot();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("onMouseDown", () => {
    it("adds a new dot if none exists in the spot", () => {
      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled();
      expect(GlobalStore.commit).not.toHaveBeenCalled();

      tool.onMouseDown(new MouseEvent("click", { clientX: 0, clientY: 0 }));

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled();
      expect(GlobalStore.commit).toHaveBeenCalledTimes(1);
      expect(GlobalStore.commit).toHaveBeenCalledWith(
        ADD_DOTS,
        expect.any(StuntSheetDot)
      );
    });

    it("removes a dot if it exists in the spot", () => {
      const stuntSheet = GlobalStore.getters.getSelectedStuntSheet;
      stuntSheet.stuntSheetDots.push(new StuntSheetDot({ x: 0, y: 2 }));

      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled();
      expect(GlobalStore.commit).not.toHaveBeenCalled();

      tool.onMouseDown(new MouseEvent("click", { clientX: 0, clientY: 2 }));

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled();
      expect(GlobalStore.commit).toHaveBeenCalledTimes(1);
      expect(GlobalStore.commit).toHaveBeenCalledWith(REMOVE_DOTS, 0);
    });
  });

  describe("onMouseMove", () => {
    it("sets grapher tool dot", () => {
      expect(BaseTool.convertClientCoordinates).not.toHaveBeenCalled();
      expect(GlobalStore.commit).not.toHaveBeenCalled();

      tool.onMouseMove(new MouseEvent("mousemove", { clientX: 0, clientY: 2 }));

      expect(BaseTool.convertClientCoordinates).toHaveBeenCalled();
      expect(GlobalStore.commit).toHaveBeenCalledTimes(1);
      expect(GlobalStore.commit).toHaveBeenCalledWith(
        SET_GRAPHER_SVG_PAN_ZOOM,
        expect.anything()
      );
      const grapherToolDots: StuntSheetDot[] = (GlobalStore.commit as jest.Mock)
        .mock.calls[0][1];
      expect(grapherToolDots).toHaveLength(1);
      expect(grapherToolDots[0].x).toBe(0);
      expect(grapherToolDots[0].y).toBe(2);
    });
  });
});
