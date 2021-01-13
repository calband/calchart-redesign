import StuntSheetDot from "@/models/StuntSheetDot";
import ContEven from "@/models/continuity/ContEven";
import { DIRECTIONS, MARCH_TYPES } from "@/models/util/constants";
import { FlowBeat, initializeFlow } from "@/models/util/FlowBeat";
import { CONT_IDS } from "@/models/continuity/BaseCont";

describe("models/continuity/ContEven", () => {
  it("has correct continuityId", () => {
    const continuity = new ContEven();
    expect(continuity.continuityId).toBe(CONT_IDS.EVEN);
  });

  describe("getHumanReadableText", () => {
    it("generates Even", () => {
      const continuity = new ContEven({
        duration: 8,
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      expect(continuity.getHumanReadableText()).toBe("EVEN MARCH MM");
    });

    it("after stringifying and parsing, generates Even", () => {
      const originalContinuity = new ContEven({
        duration: 8,
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      const parsedContinuity = new ContEven(
        JSON.parse(JSON.stringify(originalContinuity))
      );
      expect(parsedContinuity.getHumanReadableText()).toBe("EVEN MARCH MM");
    });

    it("generates EVEN MARCH HS", () => {
      const continuity = new ContEven({
        duration: 8,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe("EVEN MARCH HS");
    });
  });

  describe("addToFlow", () => {
    it("does not generate flow if endDot is undefined", () => {
      const continuity = new ContEven();
      const startDot = new StuntSheetDot({ x: 2, y: 2 });
      const flow: FlowBeat[] = initializeFlow(startDot);
      continuity.addToFlow(flow, undefined);
      expect(flow).toHaveLength(1);
      expect(flow[0]).toMatchObject({
        x: 2,
        y: 2,
      });
    });

    it("after stringifying and parsing, does not generate flow if endDot is undefined", () => {
      const originalContinuity = new ContEven();
      const parsedContinuity = new ContEven(
        JSON.parse(JSON.stringify(originalContinuity))
      );
      const startDot = new StuntSheetDot({ x: 2, y: 2 });
      const flow: FlowBeat[] = initializeFlow(startDot);
      parsedContinuity.addToFlow(flow, undefined);
      expect(flow).toHaveLength(1);
      expect(flow[0]).toMatchObject({
        x: 2,
        y: 2,
      });
    });

    describe("Generate flows", () => {
      it("generates going north", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: 6, y: 2 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [3, 2],
          [4, 2],
          [5, 2],
          [6, 2],
        ];
        const expectedDirection = DIRECTIONS.N;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going northeast", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: 6, y: 6 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [3, 3],
          [4, 4],
          [5, 5],
          [6, 6],
        ];
        const expectedDirection = DIRECTIONS.NE;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going east", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: 2, y: 6 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [2, 3],
          [2, 4],
          [2, 5],
          [2, 6],
        ];
        const expectedDirection = DIRECTIONS.E;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going southeast", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: -2, y: 6 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [1, 3],
          [0, 4],
          [-1, 5],
          [-2, 6],
        ];
        const expectedDirection = DIRECTIONS.SE;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going south", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: -2, y: 2 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [1, 2],
          [0, 2],
          [-1, 2],
          [-2, 2],
        ];
        const expectedDirection = DIRECTIONS.S;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going southwest", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: -2, y: -2 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [1, 1],
          [0, 0],
          [-1, -1],
          [-2, -2],
        ];
        const expectedDirection = DIRECTIONS.SW;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going west", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: 2, y: -2 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [2, 1],
          [2, 0],
          [2, -1],
          [2, -2],
        ];
        const expectedDirection = DIRECTIONS.W;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going northwest", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: 6, y: -2 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [3, 1],
          [4, 0],
          [5, -1],
          [6, -2],
        ];
        const expectedDirection = DIRECTIONS.NW;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going northeast", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: 6, y: 6 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [3, 3],
          [4, 4],
          [5, 5],
          [6, 6],
        ];
        const expectedDirection = DIRECTIONS.NE;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });

      it("generates going northeast small steps", () => {
        const startDot = new StuntSheetDot({ x: 2, y: 2 });
        const endDot = new StuntSheetDot({ x: 4, y: 4 });
        const expectedPoints: Array<[number, number]> = [
          [2, 2],
          [2.5, 2.5],
          [3, 3],
          [3.5, 3.5],
          [4, 4],
        ];
        const expectedDirection = DIRECTIONS.NE;

        const continuity = new ContEven({
          duration: 4,
        });
        const flow: FlowBeat[] = initializeFlow(startDot);
        continuity.addToFlow(flow, endDot);
        const expectedFlow = expectedPoints.map((p) => {
          return {
            x: p[0],
            y: p[1],
            direction: expectedDirection,
            marchType: MARCH_TYPES.MINI_MILITARY,
          };
        });
        expect(flow).toStrictEqual(expectedFlow);
      });
    });
  });
});
