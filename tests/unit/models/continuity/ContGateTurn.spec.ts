import StuntSheetDot from "@/models/StuntSheetDot";
import ContGateTurn from "@/models/continuity/ContGateTurn";
import { MARCH_TYPES } from "@/models/util/constants";
import { FlowBeat } from "@/models/util/types";
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
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([]);
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
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow[0]).toStrictEqual({
        x: 2,
        y: 1,
        direction: 180,
        marchType: MARCH_TYPES.HS,
      });
      // Using .toBeCloseTo() here because of rounding errors
      expect(flow[1].direction).toEqual(180 + 45);
      expect(flow[1].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow[1].x).toBeCloseTo(1 + Math.sqrt(2) / 2);
      expect(flow[1].y).toBeCloseTo(1 + Math.sqrt(2) / 2);
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
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow[0]).toEqual({
        x: 2,
        y: 1,
        direction: 0,
        marchType: MARCH_TYPES.HS,
      });
      // Using .toBeCloseTo() here because of rounding errors
      expect(flow[1].direction).toEqual(360 - 45);
      expect(flow[1].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow[1].x).toBeCloseTo(1 + Math.sqrt(2) / 2);
      expect(flow[1].y).toBeCloseTo(1 - Math.sqrt(2) / 2);
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
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
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
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
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
      const flow1: FlowBeat[] = [];
      continuity.addToFlow(flow1, startDot1);
      expect(flow1[0]).toEqual({
        x: 2,
        y: 1,
        direction: 0,
        marchType: MARCH_TYPES.HS,
      });
      expect(flow1[1].direction).toEqual(360 - 45);
      expect(flow1[1].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow1[1].x).toBeCloseTo(1 + Math.sqrt(2) / 2);
      expect(flow1[1].y).toBeCloseTo(1 - Math.sqrt(2) / 2);
      // Check second dot's rotation
      const startDot2 = new StuntSheetDot({ id: 2, x: 12, y: 11 });
      const flow2: FlowBeat[] = [];
      continuity.addToFlow(flow2, startDot2);
      expect(flow2[0]).toEqual({
        x: 12,
        y: 11,
        direction: 0,
        marchType: MARCH_TYPES.HS,
      });
      expect(flow2[1].direction).toEqual(360 - 45);
      expect(flow2[1].marchType).toEqual(MARCH_TYPES.HS);
      expect(flow2[1].x).toBeCloseTo(11 + Math.sqrt(2) / 2);
      expect(flow2[1].y).toBeCloseTo(11 - Math.sqrt(2) / 2);
    });
  });
});
