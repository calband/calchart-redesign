import ToolBoxSelect from "@/tools/ToolBoxSelect";
import { GlobalStore } from "@/store";
import BaseTool from "@/tools/BaseTool";
import BaseMoveTool from "@/tools/BaseMoveTool";
import StuntSheetDot from "@/models/StuntSheetDot";

describe("tools/ToolBoxSelect", () => {
  let tool: BaseTool;

  beforeEach(() => {
    BaseTool.convertClientCoordinates = jest.fn((x) => [x.clientX, x.clientY]);
    BaseTool.updateInvertedCTMMatrix = jest.fn();
    BaseMoveTool.enablePan = jest.fn();
    tool = new ToolBoxSelect();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Select a dot", () => {
    const stuntSheet = GlobalStore.getters.getSelectedStuntSheet;
    stuntSheet.stuntSheetDots.push(new StuntSheetDot({ x: 2, y: 2 }));
    stuntSheet.stuntSheetDots.push(new StuntSheetDot({ x: 4, y: 2 }));
    stuntSheet.stuntSheetDots.push(new StuntSheetDot({ x: 2, y: 4 }));

    it("Click where nothing is", () => {
      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseDown(new MouseEvent("mousedown", { clientX: 0, clientY: 0 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([[0, 0]]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 0, clientY: 0 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
    });

    it("Click on a dot", () => {
      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseDown(new MouseEvent("mousedown", { clientX: 2, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([0]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 2, clientY: 2 }));
    });

    it("Click on a space loses selection", () => {
      expect(GlobalStore.state.selectedDotIds).toEqual([0]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseDown(new MouseEvent("mousedown", { clientX: 6, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([[6, 2]]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 6, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
    });

    it("Click on a dot loses selection and adds another", () => {
      tool.onMouseDown(new MouseEvent("mousedown", { clientX: 4, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([1]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 4, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([1]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseDown(new MouseEvent("mousedown", { clientX: 2, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([0]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 2, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([0]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
    });

    it("Click on a dot with shift adds it", () => {
      tool.onMouseDown(
        new MouseEvent("mousedown", { clientX: 4, clientY: 2, shiftKey: true })
      );

      expect(GlobalStore.state.selectedDotIds).toEqual([0, 1]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 4, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([0, 1]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
    });

    it("Click on a dot with shift+alt key toggles it", () => {
      tool.onMouseDown(
        new MouseEvent("mousedown", {
          clientX: 2,
          clientY: 2,
          shiftKey: true,
          altKey: true,
        })
      );

      expect(GlobalStore.state.selectedDotIds).toEqual([1]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 2, clientY: 2 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([1]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
    });

    it("Selecting box will select all", () => {
      tool.onMouseDown(new MouseEvent("mousedown", { clientX: 0, clientY: 0 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([]);
      expect(GlobalStore.state.selectionLasso).toEqual([[0, 0]]);

      tool.onMouseMove(new MouseEvent("mousemove", { clientX: 6, clientY: 6 }));
      expect(GlobalStore.state.selectionLasso).toEqual([
        [0, 0],
        [6, 0],
        [6, 6],
        [0, 6],
        [0, 0],
      ]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 6, clientY: 6 }));

      expect(GlobalStore.state.selectedDotIds).toEqual([0, 1, 2]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
    });

    it("shift and move will move the dots", () => {
      expect(GlobalStore.state.grapherToolDots).toEqual([]);
      expect(GlobalStore.state.selectedDotIds).toEqual([0, 1, 2]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
      tool.onMouseDown(
        new MouseEvent("mousedown", { clientX: 2, clientY: 2, shiftKey: true })
      );

      const grapherToolDotsBefore = GlobalStore.state.grapherToolDots;
      expect(grapherToolDotsBefore).toHaveLength(3);
      expect(grapherToolDotsBefore[0]).toMatchObject({
        x: 2,
        y: 2,
        dotLabelIndex: null,
      });
      expect(grapherToolDotsBefore[1]).toMatchObject({
        x: 4,
        y: 2,
        dotLabelIndex: null,
      });
      expect(grapherToolDotsBefore[2]).toMatchObject({
        x: 2,
        y: 4,
        dotLabelIndex: null,
      });
      expect(GlobalStore.state.selectedDotIds).toEqual([0, 1, 2]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseMove(new MouseEvent("mousemove", { clientX: 6, clientY: 6 }));

      const grapherToolDotsAfter = GlobalStore.state.grapherToolDots;
      expect(grapherToolDotsAfter).toHaveLength(3);
      expect(grapherToolDotsAfter[0]).toMatchObject({
        x: 6,
        y: 6,
        dotLabelIndex: null,
      });
      expect(grapherToolDotsAfter[1]).toMatchObject({
        x: 8,
        y: 6,
        dotLabelIndex: null,
      });
      expect(grapherToolDotsAfter[2]).toMatchObject({
        x: 6,
        y: 8,
        dotLabelIndex: null,
      });
      expect(GlobalStore.state.selectedDotIds).toEqual([0, 1, 2]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);

      tool.onMouseUp(new MouseEvent("mouseup", { clientX: 6, clientY: 6 }));

      expect(GlobalStore.state.grapherToolDots).toEqual([]);
      expect(GlobalStore.state.selectedDotIds).toEqual([0, 1, 2]);
      expect(GlobalStore.state.selectionLasso).toEqual([]);
      expect(stuntSheet.stuntSheetDots).toEqual([
        new StuntSheetDot({ x: 6, y: 6, dotTypeIndex: 0, id: 0 }),
        new StuntSheetDot({ x: 8, y: 6, dotTypeIndex: 0, id: 1 }),
        new StuntSheetDot({ x: 6, y: 8, dotTypeIndex: 0, id: 2 }),
      ]);
    });
  });
});
