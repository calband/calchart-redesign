import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import ContETFStatic from "@/models/continuity/ContETFStatic";

describe("models/StuntSheet", () => {
  describe("calculateIssuesShallow", () => {
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
      ss.calculateIssuesShallow(0);
      expect(ss.issues).toHaveLength(1);
      expect(ss.issues[0].name).toEqual("Dot Type Has No Dots");
    });

    it("doesn't create any unneeded issues", () => {
      ss = new StuntSheet({
        stuntSheetDots: [new StuntSheetDot()],
      });
      ss.calculateIssuesShallow(0);
      expect(ss.issues).toHaveLength(0);
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
      ss.calculateIssuesShallow(0);
      expect(ss.issues).toHaveLength(2);
      expect(ss.issues[0].name).toEqual("Dots Too Close");
      expect(ss.issues[1].name).toEqual("Dots Too Close");
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
      ss.calculateIssuesShallow(0);
      expect(ss.issues).toHaveLength(2);
      expect(ss.issues[0].name).toEqual("Dots Overlapping");
      expect(ss.issues[1].name).toEqual("Dots Overlapping");
    });
  });

  describe("calculateIssuesDeep", () => {
    let ss: StuntSheet;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("calculates shallowly", () => {
      ss = new StuntSheet();
      const spy = jest.spyOn(ss, "calculateIssuesShallow");
      ss.calculateIssuesDeep(0);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("recurses to StuntSheets", () => {
      ss = new StuntSheet({
        stuntSheetDots: [new StuntSheetDot()],
      });
      const spy = jest.spyOn(ss.stuntSheetDots[0], "calculateIssuesShallow");
      ss.calculateIssuesDeep(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
