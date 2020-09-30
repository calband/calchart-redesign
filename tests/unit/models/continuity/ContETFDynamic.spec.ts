import StuntSheetDot from "@/models/StuntSheetDot";
import ContETFDynamic, {
  ETF_DYNAMIC_TYPES,
} from "@/models/continuity/ContETFDynamic";
import { DIRECTIONS, MARCH_TYPES } from "@/models/util/constants";
import { FlowBeat } from "@/models/util/types";
import { CONT_IDS } from "@/models/continuity/BaseCont";

describe("models/continuity/ContETFDynamic", () => {
  it("has correct continuityId", () => {
    const continuity = new ContETFDynamic();
    expect(continuity.continuityId).toBe(CONT_IDS.ETF_DYNAMIC);
  });

  describe("getHumanReadableText", () => {
    it("generates EW/NS FMHS", () => {
      const continuity = new ContETFDynamic({
        eightToFiveType: ETF_DYNAMIC_TYPES.EWNS,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe("EW/NS FMHS");
    });

    it("after stringifying and parsing, generates EW/NS FMHS", () => {
      const originalContinuity = new ContETFDynamic({
        eightToFiveType: ETF_DYNAMIC_TYPES.EWNS,
        marchType: MARCH_TYPES.HS,
      });
      const parsedContinuity = new ContETFDynamic(
        JSON.parse(JSON.stringify(originalContinuity))
      );
      expect(parsedContinuity.getHumanReadableText()).toBe("EW/NS FMHS");
    });

    it("generates NS/EW FMMM", () => {
      const continuity = new ContETFDynamic({
        eightToFiveType: ETF_DYNAMIC_TYPES.NSEW,
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      expect(continuity.getHumanReadableText()).toBe("NS/EW FMMM");
    });

    it("generates DHS/FMHS", () => {
      const continuity = new ContETFDynamic({
        eightToFiveType: ETF_DYNAMIC_TYPES.DFM,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe("DHS/FMHS");
    });

    it("generates FMMM/DMM", () => {
      const continuity = new ContETFDynamic({
        eightToFiveType: ETF_DYNAMIC_TYPES.FMD,
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      expect(continuity.getHumanReadableText()).toBe("FMMM/DMM");
    });
  });

  describe("addToFlow", () => {
    it("does not generate flow if endDot is undefined", () => {
      const continuity = new ContETFDynamic({
        eightToFiveType: ETF_DYNAMIC_TYPES.EWNS,
        marchType: MARCH_TYPES.HS,
      });
      const startDot = new StuntSheetDot({ x: 2, y: 2 });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot, undefined);
      expect(flow).toStrictEqual([]);
    });

    it(
      "after stringifying and parsing, does not generate flow if endDot is" +
        "undefined",
      () => {
        const originalContinuity = new ContETFDynamic({
          eightToFiveType: ETF_DYNAMIC_TYPES.EWNS,
          marchType: MARCH_TYPES.HS,
        });
        const parsedContinuity = new ContETFDynamic(
          JSON.parse(JSON.stringify(originalContinuity))
        );
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const flow: FlowBeat[] = [];
        parsedContinuity.addToFlow(flow, startDot, undefined);
        expect(flow).toStrictEqual([]);
      }
    );

    describe("No diagonals", () => {
      const startDot = new StuntSheetDot({ x: 2, y: 2 });
      const endDot = new StuntSheetDot({ x: 4, y: 4 });

      it("generates flow for EW/NS", () => {
        const continuity = new ContETFDynamic({
          eightToFiveType: ETF_DYNAMIC_TYPES.EWNS,
          marchType: MARCH_TYPES.HS,
        });
        const flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 2,
            y: 3,
            direction: DIRECTIONS.E,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 2,
            y: 4,
            direction: DIRECTIONS.E,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 3,
            y: 4,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 4,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
        ]);
      });

      it("generates flow for NS/EW", () => {
        const continuity = new ContETFDynamic({
          eightToFiveType: ETF_DYNAMIC_TYPES.NSEW,
          marchType: MARCH_TYPES.HS,
        });
        const flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 3,
            y: 2,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 2,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 3,
            direction: DIRECTIONS.E,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 4,
            direction: DIRECTIONS.E,
            marchType: MARCH_TYPES.HS,
          },
        ]);
      });
    });

    describe("Diagonals", () => {
      const startDot = new StuntSheetDot({ x: 2, y: 2 });
      const endDot = new StuntSheetDot({ x: 6, y: 4 });

      it("generates flow for DHS/FMHS", () => {
        const continuity = new ContETFDynamic({
          eightToFiveType: ETF_DYNAMIC_TYPES.DFM,
          marchType: MARCH_TYPES.HS,
        });
        const flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 3,
            y: 3,
            direction: DIRECTIONS.NE,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 4,
            direction: DIRECTIONS.NE,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 5,
            y: 4,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 6,
            y: 4,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
        ]);
      });

      it("generates flow for FMHS/DHS", () => {
        const continuity = new ContETFDynamic({
          eightToFiveType: ETF_DYNAMIC_TYPES.FMD,
          marchType: MARCH_TYPES.HS,
        });
        const flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 3,
            y: 2,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 2,
            direction: DIRECTIONS.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 5,
            y: 3,
            direction: DIRECTIONS.NE,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 6,
            y: 4,
            direction: DIRECTIONS.NE,
            marchType: MARCH_TYPES.HS,
          },
        ]);
      });
    });
  });
});
