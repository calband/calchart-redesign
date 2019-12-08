import Show from '../Show';
import BaseContinuity, { CONTINUITY_IDS } from '../continuity/BaseContinuity';
import Field from '../Field';
import StuntSheet from '../StuntSheet';
import StuntSheetDot from '../StuntSheetDot';
import ContinuityInPlace from '../continuity/ContinuityInPlace';
import ContinuityEightToFiveDynamic from '../continuity/ContinuityEightToFiveDynamic';
import ContinuityEven from '../continuity/ContinuityEven';
import ContinuityEightToFiveStatic from '../continuity/ContinuityEightToFiveStatic';
import ContinuityFollowTheLeader from '../continuity/ContinuityFollowTheLeader';
import ContinuityCounterMarch from '../continuity/ContinuityCounterMarch';
import ContinuityGateTurn from '../continuity/ContinuityGateTurn';
import ContinuityStepTwo from '../continuity/ContinuityStepTwo';

/**
 * Helper that creates a new object with Typescript class defined in proto.
 * Inspired by: http://choly.ca/post/typescript-json/
 */
export const typeHelper = (value: any, proto: any): Object => {
  let typed = Object.create(proto);
  return Object.assign(typed, value);
}

export const typeArrayHelper = (array: any[], proto: any): Object[] => {
  array.forEach((value: Object, index: number, array: Array<Object>) => {
    array[index] = typeHelper(value, proto);
  });
  return array;
}

/**
 * Helper function to get the class prototype of a continuity.
 */
export const getContinuityProto = (continuity: BaseContinuity) => {
  switch (continuity.continuityId) {
    case CONTINUITY_IDS.IN_PLACE:
      return ContinuityInPlace.prototype;

    case CONTINUITY_IDS.EIGHT_TO_FIVE_STATIC:
      return ContinuityEightToFiveStatic.prototype;
    
    case CONTINUITY_IDS.EIGHT_TO_FIVE_DYNAMIC:
      return ContinuityEightToFiveDynamic.prototype;
    
    case CONTINUITY_IDS.EVEN:
      return ContinuityEven.prototype;

    case CONTINUITY_IDS.FOLLOW_THE_LEADER:
      return ContinuityFollowTheLeader.prototype;
    
    case CONTINUITY_IDS.COUNTER_MARCH:
      return ContinuityCounterMarch.prototype;

    case CONTINUITY_IDS.GATE_TURN:
      return ContinuityGateTurn.prototype;

    case CONTINUITY_IDS.STEP_TWO:
      return ContinuityStepTwo.prototype;

    default:
      return Object.prototype;
  }
}

/**
 * The reviver function to be used in JSON.parse. Makes sure that parsed objects have the correct Typescript class.
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 * 
 * This must be done in for any field that is not a primitive type.
 */
export const showReviver = (key: string, value: any): any => {
  switch (key) {
    case 'dotTypes': // StuntSheet
      let dotTypes: BaseContinuity[][] = value;
      return dotTypes.map((continuities: BaseContinuity[]) => {
        return continuities.map((continuity: BaseContinuity) => {
          const proto = getContinuityProto(continuity);
          return typeHelper(continuity, proto);
        });
      });

    case 'stuntSheetDots': // StuntSheet
      return typeArrayHelper(value, StuntSheetDot.prototype);

    case 'field': // Show
      return typeHelper(value, Field.prototype);

    case 'stuntSheets': // Show
      return typeArrayHelper(value, StuntSheet.prototype);

    default:
      return value;
  }
};
