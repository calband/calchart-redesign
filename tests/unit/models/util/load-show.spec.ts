import Show from "@/models/Show";
import { showReviver, typeHelper, typeArrayHelper, getContinuityProto } from '@/models/util/load-show';
import Field from '@/models/Field';
import StuntSheet from '@/models/StuntSheet';
import StuntSheetDot from '@/models/StuntSheetDot';
import ContinuityInPlace from '@/models/continuity/ContinuityInPlace';
import { DIRECTION_TO_DEGREES, MARCH_TYPES } from '@/models/util/constants';
import ContinuityEightToFiveDynamic, { EIGHT_TO_FIVE_DYNAMIC_TYPES } from '@/models/continuity/ContinuityEightToFiveDynamic';
import ContinuityEven from '@/models/continuity/ContinuityEven';
import BaseContinuity, { CONTINUITY_IDS } from '@/models/continuity/BaseContinuity';
import ContinuityEightToFiveStatic from '@/models/continuity/ContinuityEightToFiveStatic';
import ContinuityFollowTheLeader from '@/models/continuity/ContinuityFollowTheLeader';
import ContinuityCounterMarch from '@/models/continuity/ContinuityCounterMarch';
import ContinuityGateTurn from '@/models/continuity/ContinuityGateTurn';
import ContinuityStepTwo from '@/models/continuity/ContinuityStepTwo';

describe('models/util/load-show', () => {
  it('typeHelper returns an object with correct type', () => {
    const field: Field = new Field();
    const fieldJson: string = JSON.stringify(field);
    const fieldParsedWithoutHelper: Object = JSON.parse(fieldJson);
    expect(fieldParsedWithoutHelper instanceof Field).toBeFalsy();
    const fieldParsed: Object = typeHelper(fieldParsedWithoutHelper, Field.prototype);
    expect(fieldParsed instanceof Field).toBeTruthy();
  });

  it('typeArrayHelper returns an array with the correct type', () => {
    const stuntSheetDots: StuntSheetDot[] = [new StuntSheetDot(0, 0), new StuntSheetDot(2, 2)];
    const stuntSheetDotsJson: string = JSON.stringify(stuntSheetDots);
    const parsedWithoutHelper: Object[] = JSON.parse(stuntSheetDotsJson);
    expect(parsedWithoutHelper instanceof Array).toBeTruthy();
    parsedWithoutHelper.forEach((dot: Object) => {
      expect(dot instanceof StuntSheetDot).toBeFalsy();
    });
    const parsed = typeArrayHelper(parsedWithoutHelper, StuntSheetDot.prototype);
    expect(parsed instanceof Array).toBeTruthy();
    parsed.forEach((dot: Object) => {
      expect(dot instanceof StuntSheetDot).toBeTruthy();
    });
  });

  describe('getContinuityProto', () => {
    const mockContinuity = (continuityId: CONTINUITY_IDS): BaseContinuity => {
      return {
        continuityId,
        duration: 0,
        marchType: MARCH_TYPES.HS,
        humanReadableText: '',
        getHumanReadableText: () => '',
        addToFlow: () => {},
      }
    }

    it('IN_PLACE', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.IN_PLACE))).toBe(ContinuityInPlace.prototype);
    });

    it('EIGHT_TO_FIVE_DYNAMIC', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC))).toBe(ContinuityEightToFiveStatic.prototype);
    });

    it('EIGHT_TO_FIVE_STATIC', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.EIGHT_TO_FIVE_DYNAMIC))).toBe(ContinuityEightToFiveDynamic.prototype);
    });

    it('EVEN', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.EVEN))).toBe(ContinuityEven.prototype);
    });

    it('FOLLOW_THE_LEADER', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.FOLLOW_THE_LEADER))).toBe(ContinuityFollowTheLeader.prototype);
    });

    it('COUNTER_MARCH', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.COUNTER_MARCH))).toBe(ContinuityCounterMarch.prototype);
    });

    it('GATE_TURN', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.GATE_TURN))).toBe(ContinuityGateTurn.prototype);
    });

    it('STEP_TWO', () => {
      expect(getContinuityProto(mockContinuity(CONTINUITY_IDS.STEP_TWO))).toBe(ContinuityStepTwo.prototype);
    });
  });

  describe('showReviver', () => {
    let show: Show;
    let showJson: string;
  
    beforeAll(() => {
      show = new Show();
      show.stuntSheets = [new StuntSheet()];
      show.stuntSheets[0].dotTypes = [[
        new ContinuityInPlace(8, DIRECTION_TO_DEGREES.E, MARCH_TYPES.MINI_MILITARY),
        new ContinuityEightToFiveDynamic(EIGHT_TO_FIVE_DYNAMIC_TYPES.EWNS, MARCH_TYPES.HS)
      ]];
      show.stuntSheets[0].stuntSheetDots = [new StuntSheetDot(0, 0)];
      showJson = JSON.stringify(show);
    });

    it('loads show from json string with correct types', () => {
      const showParsed: Show = JSON.parse(showJson, showReviver);
      expect(showParsed.field instanceof Field).toBeTruthy();
      expect(showParsed.stuntSheets instanceof Array).toBeTruthy();
      expect(showParsed.stuntSheets[0] instanceof StuntSheet).toBeTruthy();
      expect(showParsed.stuntSheets[0].dotTypes instanceof Array).toBeTruthy();
      expect(showParsed.stuntSheets[0].dotTypes[0] instanceof Array).toBeTruthy();
      expect(showParsed.stuntSheets[0].dotTypes[0][0] instanceof ContinuityInPlace).toBeTruthy();
      expect(showParsed.stuntSheets[0].dotTypes[0][1] instanceof ContinuityEightToFiveDynamic).toBeTruthy();
      expect(showParsed.stuntSheets[0].stuntSheetDots instanceof Array).toBeTruthy();
      expect(showParsed.stuntSheets[0].stuntSheetDots[0] instanceof StuntSheetDot).toBeTruthy();
    });
  });
});