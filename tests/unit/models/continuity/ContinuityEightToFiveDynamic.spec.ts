import StuntSheetDot from '@/models/StuntSheetDot';
import ContinuityEightToFiveDynamic, { EIGHT_TO_FIVE_DYNAMIC_TYPES } from '@/models/continuity/ContinuityEightToFiveDynamic';
import { MARCH_TYPES, DIRECTION_TO_DEGREES } from '@/models/util/constants';
import { FlowBeat } from '@/models/util/types';

describe('models/continuity/ContinuityEightToFiveDynamic', () => {
  describe('getHumanReadableText', () => {
    it('generates EW/NS FMHS', () => {
      const continuity = new ContinuityEightToFiveDynamic(
        EIGHT_TO_FIVE_DYNAMIC_TYPES.EWNS,
        MARCH_TYPES.HS
      );
      expect(continuity.getHumanReadableText()).toBe('EW/NS FMHS');
    });

    it('generates NS/EW FMMM', () => {
      const continuity = new ContinuityEightToFiveDynamic(
        EIGHT_TO_FIVE_DYNAMIC_TYPES.NSEW,
        MARCH_TYPES.MINI_MILITARY
      );
      expect(continuity.getHumanReadableText()).toBe('NS/EW FMMM');
    });

    it('generates DHS/FMHS', () => {
      const continuity = new ContinuityEightToFiveDynamic(
        EIGHT_TO_FIVE_DYNAMIC_TYPES.DFM,
        MARCH_TYPES.HS
      );
      expect(continuity.getHumanReadableText()).toBe('DHS/FMHS');
    });

    it('generates FMMM/DMM', () => {
      const continuity = new ContinuityEightToFiveDynamic(
        EIGHT_TO_FIVE_DYNAMIC_TYPES.FMD,
        MARCH_TYPES.MINI_MILITARY
      );
      expect(continuity.getHumanReadableText()).toBe('FMMM/DMM');
    });
  });

  describe('addToFlow', () => {
    it('does not generate flow if endDot is undefined', () => {
      const continuity = new ContinuityEightToFiveDynamic(
        EIGHT_TO_FIVE_DYNAMIC_TYPES.EWNS,
        MARCH_TYPES.HS
      );
      const startDot = new StuntSheetDot(2, 2);
      let flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot, undefined);
      expect(flow).toStrictEqual([]);
    });

    describe('No diagonals', () => {
      const startDot = new StuntSheetDot(2, 2);
      const endDot = new StuntSheetDot(4, 4);

      it('generates flow for EW/NS', () => {
        const continuity = new ContinuityEightToFiveDynamic(
          EIGHT_TO_FIVE_DYNAMIC_TYPES.EWNS,
          MARCH_TYPES.HS
        );
        let flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 2,
            y: 3,
            direction: DIRECTION_TO_DEGREES.E,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 2,
            y: 4,
            direction: DIRECTION_TO_DEGREES.E,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 3,
            y: 4,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 4,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          }
        ]);
      });

      it('generates flow for NS/EW', () => {
        const continuity = new ContinuityEightToFiveDynamic(
          EIGHT_TO_FIVE_DYNAMIC_TYPES.NSEW,
          MARCH_TYPES.HS
        );
        let flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 3,
            y: 2,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 2,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 3,
            direction: DIRECTION_TO_DEGREES.E,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 4,
            direction: DIRECTION_TO_DEGREES.E,
            marchType: MARCH_TYPES.HS,
          }
        ]);
      });
    });

    describe('Diagonals', () => {
      const startDot = new StuntSheetDot(2, 2);
      const endDot = new StuntSheetDot(6, 4);

      it('generates flow for DHS/FMHS', () => {
        const continuity = new ContinuityEightToFiveDynamic(
          EIGHT_TO_FIVE_DYNAMIC_TYPES.DFM,
          MARCH_TYPES.HS
        );
        let flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 3,
            y: 3,
            direction: DIRECTION_TO_DEGREES.NE,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 4,
            direction: DIRECTION_TO_DEGREES.NE,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 5,
            y: 4,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 6,
            y: 4,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          }
        ]);
      });

      it('generates flow for FMHS/DHS', () => {
        const continuity = new ContinuityEightToFiveDynamic(
          EIGHT_TO_FIVE_DYNAMIC_TYPES.FMD,
          MARCH_TYPES.HS
        );
        let flow: FlowBeat[] = [];
        continuity.addToFlow(flow, startDot, endDot);
        expect(flow).toStrictEqual([
          {
            x: 3,
            y: 2,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 4,
            y: 2,
            direction: DIRECTION_TO_DEGREES.N,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 5,
            y: 3,
            direction: DIRECTION_TO_DEGREES.NE,
            marchType: MARCH_TYPES.HS,
          },
          {
            x: 6,
            y: 4,
            direction: DIRECTION_TO_DEGREES.NE,
            marchType: MARCH_TYPES.HS,
          }
        ]);
      });
    });
  });
});