import StuntSheetDot from "@/models/StuntSheetDot";
import ContGateTurn from "@/models/continuity/ContGateTurn";
import { MARCH_TYPES } from "@/models/util/constants";
import { FlowBeat, initializeFlow } from "@/models/util/FlowBeat";
import { CONT_IDS } from "@/models/continuity/BaseCont";

describe("models/continuity/ContETFDynamic", () => {
  it("has correct continuityId", () => {
    const continuity = new ContGateTurn();
    expect(continuity.continuityId).toBe(CONT_IDS.GATE_TURN);
  });

  describe("getHumanReadableText", () => {
    it("generates GTHS 8 COUNTS 180 DEGREES CW", () => {
      const continuity = new ContGateTurn({});
      expect(continuity.getHumanReadableText()).toBe(
        "GTHS 8 COUNTS 180 DEGREES CW"
      );
    });
    it("generates GTHS 16 COUNTS 180 DEGREES CW", () => {
      const continuity = new ContGateTurn({ duration: 16 });
      expect(continuity.getHumanReadableText()).toBe(
        "GTHS 16 COUNTS 180 DEGREES CW"
      );
    });
    it("generates GTHS 18 COUNTS 180 DEGREES CCW", () => {
      const continuity = new ContGateTurn({ angle: -180 });
      expect(continuity.getHumanReadableText()).toBe(
        "GTHS 8 COUNTS 180 DEGREES CCW"
      );
    });
    it("generates GTHS 8 COUNTS 90 DEGREES CW", () => {
      const continuity = new ContGateTurn({ angle: 90 });
      expect(continuity.getHumanReadableText()).toBe(
        "GTHS 8 COUNTS 90 DEGREES CW"
      );
    });
    it("generates GTMM 8 COUNTS 180 DEGREES CW", () => {
      const continuity = new ContGateTurn({
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      expect(continuity.getHumanReadableText()).toBe(
        "GTMM 8 COUNTS 180 DEGREES CW"
      );
    });
    it("uses user made text if available", () => {
      const continuity = new ContGateTurn({});
      continuity.humanReadableText = "FS Pop Shuvit";
      expect(continuity.getHumanReadableText()).toBe("FS Pop Shuvit");
    });
  });

  describe("addToFlow", () => {
    it("doesn't add anything to the flow if the duration is 0", () => {
      const continuity = new ContGateTurn({
        duration: 0,
        marchType: MARCH_TYPES.HS,
        angle: 90,
      });
      const startDot = new StuntSheetDot({ x: 2, y: 1 });
      const flow: FlowBeat[] = initializeFlow(startDot);
      continuity.addToFlow(flow);
      expect(flow).toHaveLength(1);
      expect(flow[0]).toStrictEqual({
        direction: 90,
        marchType: "HS",
        x: 2,
        y: 1,
      });
    });
    it("generates a proper rotation of 90 degrees", () => {
      const centerPoints: Map<number, [number, number]> = new Map<
        number,
        [number, number]
      >();
      centerPoints.set(1, [1, 1]);
      const continuity = new ContGateTurn({
        duration: 2,
        marchType: MARCH_TYPES.HS,
        angle: 90,
        centerPoints: centerPoints,
      });
      const startDot = new StuntSheetDot({ id: 1, x: 2, y: 1 });
      const flow: FlowBeat[] = initializeFlow(startDot);
      continuity.addToFlow(flow, undefined, 1);
      expect(flow[1]).toStrictEqual({
        x: 2,
        y: 1,
        direction: 180,
        marchType: MARCH_TYPES.HS,
      });
      // Using .toBeCloseTo() here because of rounding errors
      expect(flow[2].direction).toEqual(180 + 45);
      expect(flow[2].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow[2].x).toBeCloseTo(1 + Math.sqrt(2) / 2);
      expect(flow[2].y).toBeCloseTo(1 + Math.sqrt(2) / 2);
    });
    it("generates a proper rotation of -90 degrees", () => {
      const centerPoints: Map<number, [number, number]> = new Map<
        number,
        [number, number]
      >();
      centerPoints.set(1, [1, 1]);
      const continuity = new ContGateTurn({
        duration: 2,
        marchType: MARCH_TYPES.HS,
        angle: -90,
        centerPoints: centerPoints,
      });
      const startDot = new StuntSheetDot({ id: 1, x: 2, y: 1 });
      const flow: FlowBeat[] = initializeFlow(startDot);
      continuity.addToFlow(flow, undefined, 1);
      expect(flow[1]).toEqual({
        x: 2,
        y: 1,
        direction: 0,
        marchType: MARCH_TYPES.HS,
      });
      // Using .toBeCloseTo() here because of rounding errors
      expect(flow[2].direction).toEqual(360 - 45);
      expect(flow[2].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow[2].x).toBeCloseTo(1 + Math.sqrt(2) / 2);
      expect(flow[2].y).toBeCloseTo(1 - Math.sqrt(2) / 2);
    });
    it("properly rotates the center dot by 90 degrees", () => {
      const centerPoints: Map<number, [number, number]> = new Map<
        number,
        [number, number]
      >();
      centerPoints.set(1, [1, 1]);
      const continuity = new ContGateTurn({
        duration: 2,
        marchType: MARCH_TYPES.HS,
        angle: 90,
        centerPoints: centerPoints,
      });
      const startDot = new StuntSheetDot({ id: 1, x: 1, y: 1 });
      const flow: FlowBeat[] = initializeFlow(startDot);
      continuity.addToFlow(flow, undefined, 1);
      expect(flow).toStrictEqual([
        {
          x: 1,
          y: 1,
          direction: 90,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 1,
          y: 1,
          direction: 180,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 1,
          y: 1,
          direction: 180 + 45,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });
    it("properly rotates the center dot by -90 degrees", () => {
      const centerPoints: Map<number, [number, number]> = new Map<
        number,
        [number, number]
      >();
      centerPoints.set(1, [1, 1]);
      const continuity = new ContGateTurn({
        duration: 2,
        marchType: MARCH_TYPES.HS,
        angle: -90,
        centerPoints: centerPoints,
      });
      const startDot = new StuntSheetDot({ id: 1, x: 1, y: 1 });
      const flow: FlowBeat[] = initializeFlow(startDot);
      continuity.addToFlow(flow, undefined, 1);
      expect(flow).toStrictEqual([
        {
          x: 1,
          y: 1,
          direction: 90,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 1,
          y: 1,
          direction: 0,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 1,
          y: 1,
          direction: 360 - 45,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });
    it("properly rotates dots with different centers", () => {
      const centerPoints: Map<number, [number, number]> = new Map<
        number,
        [number, number]
      >();
      centerPoints.set(1, [1, 1]);
      centerPoints.set(2, [11, 11]);
      const continuity = new ContGateTurn({
        duration: 2,
        marchType: MARCH_TYPES.HS,
        angle: -90,
        centerPoints: centerPoints,
      });
      // Check first dot's rotation
      const startDot1 = new StuntSheetDot({ id: 1, x: 2, y: 1 });
      const flow1: FlowBeat[] = initializeFlow(startDot1);
      continuity.addToFlow(flow1, undefined, 1);
      expect(flow1[1]).toEqual({
        x: 2,
        y: 1,
        direction: 0,
        marchType: MARCH_TYPES.HS,
      });
      expect(flow1[2].direction).toEqual(360 - 45);
      expect(flow1[2].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow1[2].x).toBeCloseTo(1 + Math.sqrt(2) / 2);
      expect(flow1[2].y).toBeCloseTo(1 - Math.sqrt(2) / 2);
      // Check second dot's rotation
      const startDot2 = new StuntSheetDot({ id: 2, x: 12, y: 11 });
      const flow2: FlowBeat[] = initializeFlow(startDot2);
      continuity.addToFlow(flow2, undefined, 2);
      expect(flow2[1]).toEqual({
        x: 12,
        y: 11,
        direction: 0,
        marchType: MARCH_TYPES.HS,
      });
      expect(flow2[2].direction).toEqual(360 - 45);
      expect(flow2[2].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow2[2].x).toBeCloseTo(11 + Math.sqrt(2) / 2);
      expect(flow2[2].y).toBeCloseTo(11 - Math.sqrt(2) / 2);
    });
  });
});
