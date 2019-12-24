import ContinuityInPlace from '@/models/continuity/ContinuityInPlace';
import { MARCH_TYPES } from '@/models/util/constants';
import ContinuityEightToFiveDynamic from '@/models/continuity/ContinuityEightToFiveDynamic';
import ContinuityEven from '@/models/continuity/ContinuityEven';
import BaseContinuity, { CONTINUITY_IDS } from '@/models/continuity/BaseContinuity';
import ContinuityEightToFiveStatic from '@/models/continuity/ContinuityEightToFiveStatic';
import ContinuityFollowTheLeader from '@/models/continuity/ContinuityFollowTheLeader';
import ContinuityCounterMarch from '@/models/continuity/ContinuityCounterMarch';
import ContinuityGateTurn from '@/models/continuity/ContinuityGateTurn';
import ContinuityStepTwo from '@/models/continuity/ContinuityStepTwo';
import { loadContinuity } from '@/models/continuity/load-continuity';

describe('models/util/load-continuity', () => {
  const mockContinuity = (continuityId: CONTINUITY_IDS): BaseContinuity => {
    return {
      continuityId,
      duration: 0,
      marchType: MARCH_TYPES.HS,
      humanReadableText: '',
      getHumanReadableText: () => '',
      addToFlow: () => {},
    };
  };

  it('IN_PLACE', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.IN_PLACE));
    expect(continuity instanceof ContinuityInPlace).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.IN_PLACE);
  });

  it('EIGHT_TO_FIVE_STATIC', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC));
    expect(loadContinuity(mockContinuity(CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC)) instanceof ContinuityEightToFiveStatic).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC);
  });

  it('EIGHT_TO_FIVE_DYNAMIC', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.EIGHT_TO_FIVE_DYNAMIC));
    expect(loadContinuity(mockContinuity(CONTINUITY_IDS.EIGHT_TO_FIVE_DYNAMIC)) instanceof ContinuityEightToFiveDynamic).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.EIGHT_TO_FIVE_DYNAMIC);
  });

  it('EVEN', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.EVEN));
    expect(loadContinuity(mockContinuity(CONTINUITY_IDS.EVEN)) instanceof ContinuityEven).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.EVEN);
  });

  it('FOLLOW_THE_LEADER', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.FOLLOW_THE_LEADER));
    expect(loadContinuity(mockContinuity(CONTINUITY_IDS.FOLLOW_THE_LEADER)) instanceof ContinuityFollowTheLeader).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.FOLLOW_THE_LEADER);
  });

  it('COUNTER_MARCH', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.COUNTER_MARCH));
    expect(loadContinuity(mockContinuity(CONTINUITY_IDS.COUNTER_MARCH)) instanceof ContinuityCounterMarch).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.COUNTER_MARCH);
  });

  it('GATE_TURN', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.GATE_TURN));
    expect(loadContinuity(mockContinuity(CONTINUITY_IDS.GATE_TURN)) instanceof ContinuityGateTurn).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.GATE_TURN);
  });

  it('STEP_TWO', () => {
    const continuity = loadContinuity(mockContinuity(CONTINUITY_IDS.STEP_TWO));
    expect(loadContinuity(mockContinuity(CONTINUITY_IDS.STEP_TWO)) instanceof ContinuityStepTwo).toBeTruthy();
    expect(continuity.continuityId).toBe(CONTINUITY_IDS.STEP_TWO);
  });
});
