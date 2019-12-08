import StuntSheetDot from "@/models/StuntSheetDot";
import ContinuityInPlace from '@/models/continuity/ContinuityInPlace';
import { DIRECTION_TO_DEGREES, MARCH_TYPES } from '@/models/util/constants';
import { FlowBeat } from '@/models/util/types';

describe('models/continuity/ContinuityInPlace', () => {
  const startDot = new StuntSheetDot(2, 4);

  describe('getHumanReadableText', () => {
    it('generates [MTHS E]', () => {
      const continuity = new ContinuityInPlace(0, DIRECTION_TO_DEGREES.E, MARCH_TYPES.HS);
      expect(continuity.getHumanReadableText()).toBe('[MTHS E]');
    });

    it('generates [MTMM W]', () => {
      const continuity = new ContinuityInPlace(0, DIRECTION_TO_DEGREES.W, MARCH_TYPES.MINI_MILITARY);
      expect(continuity.getHumanReadableText()).toBe('[MTMM W]');
    });

    it('generates MTHS 8 N', () => {
      const continuity = new ContinuityInPlace(8, DIRECTION_TO_DEGREES.N, MARCH_TYPES.HS);
      expect(continuity.getHumanReadableText()).toBe('MTHS 8 N');
    });

    it('generates Close 8 S', () => {
      const continuity = new ContinuityInPlace(8, DIRECTION_TO_DEGREES.S, MARCH_TYPES.CLOSE);
      expect(continuity.getHumanReadableText()).toBe('Close 8 S');
    });

    it('uses user made text if available', () => {
      const continuity = new ContinuityInPlace(8, DIRECTION_TO_DEGREES.S, MARCH_TYPES.CLOSE);
      continuity.humanReadableText = 'Kneel 8 E';
      expect(continuity.getHumanReadableText()).toBe('Kneel 8 E');
    });
  });

  describe('addToFlow', () => {
    it('if duration is 0 adds one FlowBeat', () => {
      const continuity = new ContinuityInPlace(0, DIRECTION_TO_DEGREES.E, MARCH_TYPES.HS);
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([{
        x: 2,
        y: 4,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS
      }]);
    });

    it('if duration is 2 adds two FlowBeats', () => {
      const continuity = new ContinuityInPlace(2, DIRECTION_TO_DEGREES.E, MARCH_TYPES.HS);
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTION_TO_DEGREES.E,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 2,
          y: 4,
          direction: DIRECTION_TO_DEGREES.E,
          marchType: MARCH_TYPES.HS
        }
      ]);
    });
  });
});