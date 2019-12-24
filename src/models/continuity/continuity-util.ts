import { FlowBeat } from '../util/types';

import StuntSheetDot from '../StuntSheetDot';

import { DIRECTION_TO_DEGREES, MARCH_TYPES } from '../util/constants';

/**
 * Decides the starting position for the upcoming continuity
 * @returns [x, y]
 */
export const startPositionHelper = (flow: FlowBeat[], startDot: StuntSheetDot): [number, number] => {
  let startX: number;
  let startY: number;
  if (flow.length === 0) {
    startX = startDot.x;
    startY = startDot.y;
  } else {
    const lastFlowBeat: FlowBeat = flow[flow.length - 1];
    startX = lastFlowBeat.x;
    startY = lastFlowBeat.y;
  }
  return [startX, startY];
};

/**
 * Helper function to march in either north or south (eight to five)
 *
 * @param offsetX    - How many steps to march. Positive is north, negative is south.
 * @param direction? - To enforce a direction to face, set this parameter. If undefined, the marcher will face the direction they are marching.
 * @returns [x, y] ending coordinates
 */
export const nsHelper = (flow: FlowBeat[], startX: number, startY: number, offsetX: number, marchType: MARCH_TYPES, direction?: number): [number, number] => {
  if (direction === undefined) {
    direction = Math.sign(offsetX) ? DIRECTION_TO_DEGREES.N : DIRECTION_TO_DEGREES.S;
  }

  for (let step = 1; step <= Math.abs(offsetX); step += 1) {
    flow.push({
      x: startX + Math.sign(offsetX) * step,
      y: startY,
      direction: direction,
      marchType: marchType,
    });
  }

  return [startX + offsetX, startY];
};

/**
 * Helper function to march in either north or south (eight to five)
 *
 * @param offsetY    - How many steps to march. Positive is east, negative is west.
 * @param direction? - To enforce a direction to face, set this parameter. If undefined, the marcher will face the direction they are marching.
 * @returns [x, y] ending coordinates
 */
export const ewHelper = (flow: FlowBeat[], startX: number, startY: number, offsetY: number, marchType: MARCH_TYPES, direction?: number): [number, number] => {
  if (direction === undefined) {
    direction = Math.sign(offsetY) ? DIRECTION_TO_DEGREES.E : DIRECTION_TO_DEGREES.W;
  }

  for (let step = 1; step <= Math.abs(offsetY); step += 1) {
    flow.push({
      x: startX,
      y: startY + Math.sign(offsetY) * step,
      direction: direction,
      marchType: marchType,
    });
  }

  return [startX, startY + offsetY];
};

/**
 * Helper function to march in a diagonal (eight to five)
 *
 * @param offsetX    - Positive is north, negative is south.
 * @param offsetY    - Positive is east, negative is west.
 * @param direction  - To enforce a direction to face, set this parameter. If undefined, the marcher will face the direction they are marching.
 * @returns [x, y] ending coordinates
 */
export const diagonalHelper = (flow: FlowBeat[], startX: number, startY: number, offsetX: number, offsetY: number, marchType: MARCH_TYPES, direction?: number): [number, number] => {
  if (Math.abs(offsetX) !== Math.abs(offsetY)) {
    throw `offsetX (${offsetX}) and offsetY (${offsetY}) are not equal!`;
  }

  if (direction === undefined) {
    if (Math.sign(offsetX) > 0) {
      direction = Math.sign(offsetY) ? DIRECTION_TO_DEGREES.NE : DIRECTION_TO_DEGREES.NW;
    } else {
      direction = Math.sign(offsetY) ? DIRECTION_TO_DEGREES.SE : DIRECTION_TO_DEGREES.SW;
    }
  }

  for (let step = 1; step <= Math.abs(offsetX); step += 1) {
    flow.push({
      x: startX + Math.sign(offsetX) * step,
      y: startY + Math.sign(offsetY) * step,
      direction: direction,
      marchType: marchType,
    });
  }

  return [startX + offsetX, startY + offsetY];
};
