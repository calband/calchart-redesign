import ContInPlace from '@/models/continuity/ContInPlace'
import { MARCH_TYPES } from '@/models/util/constants'
import ContETFDynamic from '@/models/continuity/ContETFDynamic'
import ContEven from '@/models/continuity/ContEven'
import BaseCont, { CONT_IDS } from '@/models/continuity/BaseCont'
import ContETFStatic from '@/models/continuity/ContETFStatic'
import ContFollowLeader from '@/models/continuity/ContFollowLeader'
import ContCounterMarch from '@/models/continuity/ContCounterMarch'
import ContGateTurn from '@/models/continuity/ContGateTurn'
import ContStepTwo from '@/models/continuity/ContStepTwo'
import { loadContinuity } from '@/models/continuity/load-continuity'

describe('models/util/load-continuity', () => {
  const mockContinuity = (continuityId: CONT_IDS): BaseCont => {
    return {
      continuityId,
      duration: 0,
      marchType: MARCH_TYPES.HS,
      humanReadableText: '',
      getHumanReadableText: () => '',
      addToFlow: () => null
    }
  }

  it('IN_PLACE', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.IN_PLACE))
    expect(continuity instanceof ContInPlace).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.IN_PLACE)
  })

  it('ETF_STATIC', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.ETF_STATIC))
    expect(continuity instanceof ContETFStatic).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.ETF_STATIC)
  })

  it('ETF_DYNAMIC', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.ETF_DYNAMIC))
    expect(continuity instanceof ContETFDynamic).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.ETF_DYNAMIC)
  })

  it('EVEN', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.EVEN))
    expect(continuity instanceof ContEven).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.EVEN)
  })

  it('FOLLOW_LEADER', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.FOLLOW_LEADER))
    expect(continuity instanceof ContFollowLeader).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.FOLLOW_LEADER)
  })

  it('COUNTER_MARCH', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.COUNTER_MARCH))
    expect(continuity instanceof ContCounterMarch).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.COUNTER_MARCH)
  })

  it('GATE_TURN', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.GATE_TURN))
    expect(continuity instanceof ContGateTurn).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.GATE_TURN)
  })

  it('STEP_TWO', () => {
    const continuity = loadContinuity(mockContinuity(CONT_IDS.STEP_TWO))
    expect(continuity instanceof ContStepTwo).toBeTruthy()
    expect(continuity.continuityId).toBe(CONT_IDS.STEP_TWO)
  })
})
