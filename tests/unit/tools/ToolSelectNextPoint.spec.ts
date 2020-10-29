import ToolSelectNextPoint from "@/tools/ToolSelectNextPoint";
import { GlobalStore } from "@/store";
import BaseTool from "@/tools/BaseTool";
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import Show from "@/models/Show";

describe("tools/ToolSelectNextPoint", () => {
  describe("onClick", () => {
    beforeAll(() => {
      const currentSS = new StuntSheet({
        stuntSheetDots: [
          new StuntSheetDot({
            x: 0,
            y: 2,
          }),
        ],
      });
      const nextSS = new StuntSheet({
        stuntSheetDots: [
          new StuntSheetDot({
            x: 4,
            y: 4,
          }),
        ],
      });
      GlobalStore.commit(
        "setShow",
        new Show({
          stuntSheets: [currentSS, nextSS],
        })
      );
      GlobalStore.commit("setToolSelected", new ToolSelectNextPoint());
    });

    it("the first click selects the current stuntsheet's dot", () => {
      BaseTool.convertClientCoordinates = jest.fn().mockReturnValue([0, 2]);
      const tool = GlobalStore.state.toolSelected as ToolSelectNextPoint;
      expect(tool.currentSSDotIndex).toBeNull();
      tool.onClick(new MouseEvent("click"));
      expect(tool.currentSSDotIndex).toBe(0);
    });

    it("the second click selects the next stuntsheet's dot", () => {
      BaseTool.convertClientCoordinates = jest.fn().mockReturnValue([4, 4]);
      const tool = GlobalStore.state.toolSelected as ToolSelectNextPoint;
      const stuntSheets = GlobalStore.state.show.stuntSheets;
      expect(stuntSheets[0].stuntSheetDots[0].dotLabelIndex).toBeNull();
      expect(stuntSheets[1].stuntSheetDots[0].dotLabelIndex).toBeNull();
      tool.onClick(new MouseEvent("click"));
      expect(tool.currentSSDotIndex).toBeNull();
      const updatedStuntSheets = GlobalStore.state.show.stuntSheets;
      expect(updatedStuntSheets[0].stuntSheetDots[0].dotLabelIndex).toBe(0);
      expect(updatedStuntSheets[1].stuntSheetDots[0].dotLabelIndex).toBe(0);
    });
  });
});
