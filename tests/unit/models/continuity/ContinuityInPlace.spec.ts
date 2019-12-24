import StuntSheetDot from '@/models/StuntSheetDot';
import ContinuityInPlace from '@/models/continuity/ContinuityInPlace';
import { DIRECTION_TO_DEGREES, MARCH_TYPES } from '@/models/util/constants';
import { FlowBeat } from '@/models/util/types';
import { CONTINUITY_IDS } from '@/models/continuity/BaseContinuity';

describe('models/continuity/ContinuityInPlace', () => {
  const startDot = new StuntSheetDot({ x: 2, y: 4 });

  it('has correct continuityId', () => {
    const continuity = new ContinuityInPlace();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.IN_PLACE);
  });

  describe('getHumanReadableText', () => {
    it('generates [MTHS E]', () => {
      const continuity = new ContinuityInPlace({
        duration: 0,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe('[MTHS E]');
    });

    it('after stringifying and parsing, generates [MTHS E]', () => {
      const originalContinuity = new ContinuityInPlace({
        duration: 0,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS,
      });
      const parsedContinuity = new ContinuityInPlace(
        JSON.parse(JSON.stringify(originalContinuity))
      );
      expect(parsedContinuity.getHumanReadableText()).toBe('[MTHS E]');
    });

    it('generates [MTMM W]', () => {
      const continuity = new ContinuityInPlace({
        duration: 0,
        direction: DIRECTION_TO_DEGREES.W,
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      expect(continuity.getHumanReadableText()).toBe('[MTMM W]');
    });

    it('generates MTHS 8 N', () => {
      const continuity = new ContinuityInPlace({
        duration: 8,
        direction: DIRECTION_TO_DEGREES.N,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe('MTHS 8 N');
    });

    it('generates Close 8 S', () => {
      const continuity = new ContinuityInPlace({
        duration: 8,
        direction: DIRECTION_TO_DEGREES.S,
        marchType: MARCH_TYPES.CLOSE,
      });
      expect(continuity.getHumanReadableText()).toBe('Close 8 S');
    });

    it('uses user made text if available', () => {
      const continuity = new ContinuityInPlace({
        duration: 8,
        direction: DIRECTION_TO_DEGREES.S,
        marchType: MARCH_TYPES.CLOSE,
      });
      continuity.humanReadableText = 'Kneel 8 E';
      expect(continuity.getHumanReadableText()).toBe('Kneel 8 E');
    });
  });

  describe('addToFlow', () => {
    it('if duration is 0 adds one FlowBeat', () => {
      const continuity = new ContinuityInPlace({
        duration: 0,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([{
        x: 2,
        y: 4,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS,
      }]);
    });

    it('after stringifying and parsing, if duration is 0 adds one FlowBeat', () => {
      const originalContinuity = new ContinuityInPlace({
        duration: 0,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS,
      });
      const parsedContinuity = new ContinuityInPlace(
        JSON.parse(JSON.stringify(originalContinuity))
      );
      const flow: FlowBeat[] = [];
      parsedContinuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([{
        x: 2,
        y: 4,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS,
      }]);
    });

    it('if duration is 2 adds two FlowBeats', () => {
      const continuity = new ContinuityInPlace({
        duration: 2,
        direction: DIRECTION_TO_DEGREES.E,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([
        {
          x: 2,
          y: 4,
          direction: DIRECTION_TO_DEGREES.E,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 2,
          y: 4,
          direction: DIRECTION_TO_DEGREES.E,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });
  });
});
