import StuntSheetDot from "../StuntSheetDot";
import { MARCH_TYPES } from "../util/constants";
import { FlowBeat } from "../util/types";

/**
 * Defines a unique identifier for each continuity class so that it is possible
 * to deserialize from a JSON string.
 */
export enum CONT_IDS {
  IN_PLACE,
  ETF_STATIC,
  ETF_DYNAMIC,
  EVEN,
  FOLLOW_LEADER,
  COUNTER_MARCH,
  GATE_TURN,
  STEP_TWO,
}

/**
 * Defines a specific movement that is used by a group of marchers to get to
 * their next positions.
 *
 * @property continuityId      - Identifier for deserializer.
 * @property duration          - How many beats to execute. If 0, it indicates
 *                               to do the continuity until reached the end
 *                               position or for the rest of the stunt sheet.
 * @property marchType         - Marks each generated FlowBeat with this type.
 * @property humanReadableText - User defined text to be used to describe the
 *                               continuity to bandsmen. Leave blank to use
 *                               the computer generated text.
 */
export default interface BaseCont {
  readonly continuityId: CONT_IDS;

  duration: number;

  marchType: MARCH_TYPES;

  humanReadableText: string;

  /**
   * If the user has not defined text, generate the continuity's description
   */
  getHumanReadableText(): string;

  /**
   * Execute the continuity for the specified dot and flow. Directly concats
   * to flow.
   *
   * @param flow     - The flow to concat
   * @param startDot - The dot in the start stuntsheet
   * @param endDot   - The dot in the next stuntsheet
   */
  addToFlow(
    flow: FlowBeat[],
    startDot: StuntSheetDot,
    endDot?: StuntSheetDot
  ): void;
}
