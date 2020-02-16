import StuntSheetDot from '@/models/StuntSheetDot';
import ContInPlace from '@/models/continuity/ContInPlace';
import { DIRECTIONS, MARCH_TYPES } from '@/models/util/constants';
import { FlowBeat } from '@/models/util/types';
import { CONT_IDS } from '@/models/continuity/BaseCont';

describe('models/continuity/ContInPlace', () => {
  const startDot = new StuntSheetDot({ x: 2, y: 4 });

  it('has correct continuityId', () => {
    const continuity = new ContInPlace();
    expect(continuity.continuityId).toBe(CONT_IDS.IN_PLACE);
  });

  describe('getHumanReadableText', () => {
    it('generates [MTHS E]', () => {
      const continuity = new ContInPlace({
        duration: 0,
        direction: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe('[MTHS E]');
    });

    it('after stringifying and parsing, generates [MTHS E]', () => {
      const originalContinuity = new ContInPlace({
        duration: 0,
        direction: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      const parsedContinuity
        = new ContInPlace(JSON.parse(JSON.stringify(originalContinuity)));
      expect(parsedContinuity.getHumanReadableText()).toBe('[MTHS E]');
    });

    it('generates [MTMM W]', () => {
      const continuity = new ContInPlace({
        duration: 0,
        direction: DIRECTIONS.W,
        marchType: MARCH_TYPES.MINI_MILITARY,
      });
      expect(continuity.getHumanReadableText()).toBe('[MTMM W]');
    });

    it('generates MTHS 8 N', () => {
      const continuity = new ContInPlace({
        duration: 8,
        direction: DIRECTIONS.N,
        marchType: MARCH_TYPES.HS,
      });
      expect(continuity.getHumanReadableText()).toBe('MTHS 8 N');
    });

    it('generates Close 8 S', () => {
      const continuity = new ContInPlace({
        duration: 8,
        direction: DIRECTIONS.S,
        marchType: MARCH_TYPES.CLOSE,
      });
      expect(continuity.getHumanReadableText()).toBe('Close 8 S');
    });

    it('uses user made text if available', () => {
      const continuity = new ContInPlace({
        duration: 8,
        direction: DIRECTIONS.S,
        marchType: MARCH_TYPES.CLOSE,
      });
      continuity.humanReadableText = 'Kneel 8 E';
      expect(continuity.getHumanReadableText()).toBe('Kneel 8 E');
    });
  });

  describe('addToFlow', () => {
    it('if duration is 0 adds one FlowBeat', () => {
      const continuity = new ContInPlace({
        duration: 0,
        direction: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      });
      const flow: FlowBeat[] = [];
      continuity.addToFlow(flow, startDot);
      expect(flow).toStrictEqual([{
        x: 2,
        y: 4,
        direction: DIRECTIONS.E,
        marchType: MARCH_TYPES.HS,
      }]);
    });

    it(
      'after stringifying and parsing, if duration is 0 adds one FlowBeat',
      () => {
        const originalContinuity = new ContInPlace({
          duration: 0,
          direction: DIRECTIONS.E,
          marchType: MARCH_TYPES.HS,
        });
        const parsedContinuity
          = new ContInPlace(JSON.parse(JSON.stringify(originalContinuity)));
        const flow: FlowBeat[] = [];
        parsedContinuity.addToFlow(flow, startDot);
        expect(flow).toStrictEqual([{
          x: 2,
          y: 4,
          direction: DIRECTIONS.E,
          marchType: MARCH_TYPES.HS,
        }]);
      },
    );

    it('if duration is 2 adds two FlowBeats', () => {
      const continuity = new ContInPlace({
        duration: 2,
        direction: DIRECTIONS.E,
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
          y: 4,
          direction: DIRECTIONS.E,
          marchType: MARCH_TYPES.HS,
        },
      ]);
    });
  });
});
