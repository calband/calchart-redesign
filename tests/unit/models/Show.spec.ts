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
    });

    it("works correctly after stringifying and parsing", () => {
      show = new Show(JSON.parse(JSON.stringify(show)));
      expect(mockAddToFlow).toHaveBeenCalledTimes(0);
      show.generateFlows(0);
      expect(mockAddToFlow).toHaveBeenCalledTimes(4);
    });
  });

  describe("calculateIssuesShallow", () => {
    let show: Show;

    it("doesn't create any unneeded issues", () => {
      show = new Show();
      show.calculateIssuesShallow();
      expect(show.issues).toHaveLength(0);
    });

    it("warns if no stuntSheets", () => {
      show = new Show({
        stuntSheets: [],
      });
      show.calculateIssuesShallow();
      expect(show.issues).toHaveLength(1);
      expect(show.issues[0].name).toEqual("No Stuntsheets");
    });

    it("warns if no title", () => {
      show = new Show({
        title: "",
      });
      show.calculateIssuesShallow();
      expect(show.issues).toHaveLength(1);
      expect(show.issues[0].name).toEqual("No Title");
    });

    it("warns if uneven dot counts", () => {
      const SS1: StuntSheet = new StuntSheet({
        stuntSheetDots: [
          new StuntSheetDot({ dotTypeIndex: 0 }),
          new StuntSheetDot({ dotTypeIndex: 0 }),
          new StuntSheetDot({ dotTypeIndex: 1 }),
        ],
        dotTypes: [[new ContInPlace()], [new ContInPlace(), new ContInPlace()]],
      });
      const SS2: StuntSheet = new StuntSheet({
        stuntSheetDots: [
          new StuntSheetDot({ dotTypeIndex: 0 }),
          new StuntSheetDot({ dotTypeIndex: 0 }),
        ],
        dotTypes: [[new ContInPlace()], [new ContInPlace(), new ContInPlace()]],
      });
      show = new Show({
        stuntSheets: [SS1, SS2],
      });
      show.calculateIssuesShallow();
      expect(show.issues).toHaveLength(1);
      expect(show.issues[0].name).toEqual("Stuntsheet Dot Count");
    });
  });

  describe("calculateIssuesDeep", () => {
    let show: Show;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("calculates shallowly", () => {
      show = new Show({});
      const spy = jest.spyOn(show, "calculateIssuesShallow");
      show.calculateIssuesDeep();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("recurses to StuntSheets", () => {
      show = new Show({
        stuntSheets: [new StuntSheet()],
      });
      const spy = jest.spyOn(show.stuntSheets[0], "calculateIssuesDeep");
      show.calculateIssuesDeep();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
