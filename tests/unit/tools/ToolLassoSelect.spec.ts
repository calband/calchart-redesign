import ToolLassoSelect from "@/tools/ToolLassoSelect";
import { GlobalStore } from "@/store";
import BaseTool from "@/tools/BaseTool";
import BaseMoveTool from "@/tools/BaseMoveTool";

describe("tools/ToolBoxSelect", () => {
  let tool: BaseTool;

  beforeEach(() => {
    BaseTool.convertClientCoordinates = jest.fn((x) => [x.clientX, x.clientY]);
    BaseTool.updateInvertedCTMMatrix = jest.fn();
    BaseMoveTool.enablePan = jest.fn();
    tool = new ToolLassoSelect();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Selecting with a lasso", () => {
    it("Click where nothing is", () => {
      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseDown(new MouseEvent("mousedown", { clientX: 0, clientY: 0 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([[0, 0]]);

      tool.onMouseMove(new MouseEvent("mousemove", { clientX: 3, clientY: 1 }));

      expect(GlobalStore.state.selectionLasso).toEqual([
        [0, 0],
        [3, 1],
      ]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 3, clientY: 1 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
    });
  });
});
