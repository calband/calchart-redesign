import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import ContETFStatic from "@/models/continuity/ContETFStatic";

describe("models/StuntSheet", () => {
  describe("calculateWarningsShallow", () => {
    let ss: StuntSheet;

    it("warns if no dots", () => {
      ss = new StuntSheet({
        stuntSheetDots: [],
      });
    });

    it("warns if dot type has no assigned dots", () => {
      ss = new StuntSheet({
        dotTypes: [[new ContETFStatic()]],
      });
      ss.calculateWarningsShallow(0);
      expect(ss.warnings).toHaveLength(1);
      expect(ss.warnings[0].name).toEqual("Dot Type Has No Dots");
    });

    it("doesn't create any unneeded warnings", () => {
      ss = new StuntSheet({
        stuntSheetDots: [new StuntSheetDot()],
      });
      ss.calculateWarningsShallow(0);
      expect(ss.warnings).toHaveLength(0);
    });

    it("warns if dots are too close", () => {
      const dot1: StuntSheetDot = new StuntSheetDot({
        x: 50,
        y: 50,
      });
      const dot2: StuntSheetDot = new StuntSheetDot({
        x: 50.1,
        y: 50.1,
      });
      ss = new StuntSheet({
        stuntSheetDots: [dot1, dot2],
      });
      ss.calculateWarningsShallow(0);
      expect(ss.warnings).toHaveLength(2);
      expect(ss.warnings[0].name).toEqual("Dots Too Close");
      expect(ss.warnings[1].name).toEqual("Dots Too Close");
    });

    it("warns if overlapping dots", () => {
      const dot1: StuntSheetDot = new StuntSheetDot({
        x: 50,
        y: 50,
      });
      const dot2: StuntSheetDot = new StuntSheetDot({
        x: 50,
        y: 50,
      });
      ss = new StuntSheet({
        stuntSheetDots: [dot1, dot2],
      });
      ss.calculateWarningsShallow(0);
      expect(ss.warnings).toHaveLength(2);
      expect(ss.warnings[0].name).toEqual("Dots Overlapping");
      expect(ss.warnings[1].name).toEqual("Dots Overlapping");
    });
  });

  describe("calculateWarningsDeep", () => {
    let ss: StuntSheet;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("calculates shallowly", () => {
      ss = new StuntSheet();
      const spy = jest.spyOn(ss, "calculateWarningsShallow");
      ss.calculateWarningsDeep(0);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("recurses to StuntSheets", () => {
      ss = new StuntSheet({
        stuntSheetDots: [new StuntSheetDot()],
      });
      const spy = jest.spyOn(ss.stuntSheetDots[0], "calculateWarningsShallow");
      ss.calculateWarningsDeep(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
