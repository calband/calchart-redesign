import StuntSheetDot from "../StuntSheetDot";
import { DIRECTIONS, MARCH_TYPES } from "./constants";

/**
 * Defines what a bandsman is doing at a specified beat.
 */
export interface FlowBeat {
  x: number;
  y: number;
  direction: number;
  marchType: MARCH_TYPES;
}

export const initializeFlow = (startDot: StuntSheetDot): FlowBeat[] => [
  {
    x: startDot.x,
    y: startDot.y,
    direction: DIRECTIONS.E,
    marchType: MARCH_TYPES.HS,
  },
];
