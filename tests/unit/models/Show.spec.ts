import Show from "@/models/Show";
import StuntSheet from "@/models/StuntSheet";
import ContInPlace from "@/models/continuity/ContInPlace";
import StuntSheetDot from "@/models/StuntSheetDot";

const mockAddToFlow = jest.fn();
jest.mock("@/models/continuity/load-continuity", () => ({
  loadContinuity: jest.fn().mockImplementation(() => {
    return {
      addToFlow: mockAddToFlow,
    };
  }),
}));

describe("models/Show", () => {
  describe("generateFlows", () => {
    let show: Show;

    beforeEach(() => {
      const startSS: StuntSheet = new StuntSheet({
        stuntSheetDots: [
          new StuntSheetDot({ dotTypeIndex: 0 }),
          new StuntSheetDot({ dotTypeIndex: 0 }),
          new StuntSheetDot({ dotTypeIndex: 1 }),
        ],
        dotTypes: [[new ContInPlace()], [new ContInPlace(), new ContInPlace()]],
      });

      show = new Show({
        stuntSheets: [startSS, new StuntSheet()],
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("addToFlow is called 4 times, and on all dots", () => {
      expect(mockAddToFlow).toHaveBeenCalledTimes(0);
      show.generateFlows(0);
      expect(mockAddToFlow).toHaveBeenCalledTimes(4);
      expect(mockAddToFlow).toHaveBeenCalledWith(
        [],
        show.stuntSheets[0].stuntSheetDots[0],
        undefined
      );
      expect(mockAddToFlow).toHaveBeenCalledWith(
        [],
        show.stuntSheets[0].stuntSheetDots[1],
        undefined
      );
      expect(mockAddToFlow).toHaveBeenCalledWith(
        [],
        show.stuntSheets[0].stuntSheetDots[2],
        undefined
      );
    });

    it("works correctly after stringifying and parsing", () => {
      show = new Show(JSON.parse(JSON.stringify(show)));
      expect(mockAddToFlow).toHaveBeenCalledTimes(0);
      show.generateFlows(0);
      expect(mockAddToFlow).toHaveBeenCalledTimes(4);
      expect(mockAddToFlow).toHaveBeenCalledWith(
        [],
        show.stuntSheets[0].stuntSheetDots[0],
        undefined
      );
      expect(mockAddToFlow).toHaveBeenCalledWith(
        [],
        show.stuntSheets[0].stuntSheetDots[1],
        undefined
      );
      expect(mockAddToFlow).toHaveBeenCalledWith(
        [],
        show.stuntSheets[0].stuntSheetDots[2],
        undefined
      );
    });
  });
});
