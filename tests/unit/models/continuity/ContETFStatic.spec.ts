import StuntSheetDot from "@/models/StuntSheetDot";
import ContETFStatic from "@/models/continuity/ContETFStatic";
import { DIRECTIONS, MARCH_TYPES } from "@/models/util/constants";
import { FlowBeat } from "@/models/util/types";
import { CONT_IDS } from "@/models/continuity/BaseCont";

describe("models/continuity/ETFStatic", () => {
  const startDot = new StuntSheetDot({ x: 2, y: 4 });

  it("has correct continuityId", () => {
    const continuity = new ContETFStatic();
    expect(continuity.continuityId).toBe(CONT_IDS.ETF_STATIC);
  });

  describe("getHumanReadableText", () => {
    it("generates FMHS 8 E", () => {
      const continuity = new ContETFStatic({
        duration: 8,
        marchingDirection: DIRECTIONS.E,
        facingDirection: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe("FMHS 8 E");
    });

    it("defaults facingDirection to marchingDirection if left blank", () => {
      const continuity = new ContETFStatic({
        duration: 8,
        marchingDirection: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe("FMHS 8 E");
      expect(continuity.facingDirection === DIRECTIONS.E);
    });

    it("after stringifying and parsing, generates MTHS E", () => {
      const originalContinuity = new ContETFStatic({
        duration: 8,
        marchingDirection: DIRECTIONS.E,
        facingDirection: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      const parsedContinuity = new ContETFStatic(
        JSON.parse(JSON.stringify(originalContinuity))
      );
      expect(parsedContinuity.getHumanReadableText()).toBe("FMHS 8 E");
    });

    it("generates FMMM 8 W", () => {
      const continuity = new ContETFStatic({
        duration: 8,
        marchingDirection: DIRECTIONS.W,
        facingDirection: DIRECTIONS.W,
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      expect(continuity.getHumanReadableText()).toBe("FMMM 8 W");
    });

    it("generates MTHS 8 N FACING W", () => {
      const continuity = new ContETFStatic({
        duration: 8,
        marchingDirection: DIRECTIONS.N,
        facingDirection: DIRECTIONS.W,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe("FMHS 8 N FACING W");
    });

    it("uses user made text if available", () => {
      const continuity = new ContETFStatic({
        duration: 8,
        marchingDirection: DIRECTIONS.S,
        marchType: MARCH_TYPES.CLOSE,
      });
      continuity.humanReadableText = "Jump 8 S";
      expect(continuity.getHumanReadableText()).toBe("Jump 8 S");
    });
  });

  describe("addToFlow", () => {
    it("if duration is 0 doesn't add a flowbeat", () => {
      const continuity = new ContETFStatic({
        duration: 0,
        marchingDirection: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([]);
    });

    it("if duration is 2 adds two FlowBeats", () => {
      const continuity = new ContETFStatic({
        duration: 2,
        marchingDirection: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTIONS.E,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 2,
          y: 5,
          direction: DIRECTIONS.E,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });

    it("properly adds westward marching", () => {
      const continuity = new ContETFStatic({
        duration: 2,
        marchingDirection: DIRECTIONS.W,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTIONS.W,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 2,
          y: 3,
          direction: DIRECTIONS.W,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });

    it("properly adds southward marching", () => {
      const continuity = new ContETFStatic({
        duration: 2,
        marchingDirection: DIRECTIONS.S,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTIONS.S,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 1,
          y: 4,
          direction: DIRECTIONS.S,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });

    it("properly adds northward marching", () => {
      const continuity = new ContETFStatic({
        duration: 2,
        marchingDirection: DIRECTIONS.N,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTIONS.N,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 3,
          y: 4,
          direction: DIRECTIONS.N,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });

    it("properly allows different facing direction", () => {
      const continuity = new ContETFStatic({
        duration: 2,
        marchingDirection: DIRECTIONS.N,
        facingDirection: DIRECTIONS.S,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTIONS.S,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 3,
          y: 4,
          direction: DIRECTIONS.S,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });

    it("properly handles diagonal marching", () => {
      const continuity = new ContETFStatic({
        duration: 2,
        marchingDirection: DIRECTIONS.NE,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTIONS.NE,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 3,
          y: 5,
          direction: DIRECTIONS.NE,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });
  });
});
