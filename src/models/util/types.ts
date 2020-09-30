import { MARCH_TYPES } from "./constants";

/**
 * Defines what a bandsman is doing at a specified beat.
 */
export interface FlowBeat {
  x: number;
  y: number;
  direction: number;
  marchType: MARCH_TYPES;
}
