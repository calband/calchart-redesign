import { FlowBeat } from "../util/FlowBeat";

import { DIRECTIONS, MARCH_TYPES } from "../util/constants";

/**
 * Helper function to march in either north or south (eight to five)
 *
 * @param offsetX    - How many steps to march. Positive is north, negative is
 *                     south.
 * @param direction? - To enforce a direction to face, set this parameter. If
 *                     undefined, the marcher will face the direction they are
 *                     marching.
 */
export const nsHelper = (
  flow: FlowBeat[],
  offsetX: number,
  marchType: MARCH_TYPES,
  direction?: number
): void => {
  if (offsetX === 0) {
    return;
  }
  if (direction === undefined) {
    direction = Math.sign(offsetX) ? DIRECTIONS.N : DIRECTIONS.S;
  }

  const lastFlowBeat = flow[flow.length - 1];
  lastFlowBeat.direction = direction;
  lastFlowBeat.marchType = marchType;

  for (let step = 1; step <= Math.abs(offsetX); step += 1) {
    flow.push({
      x: lastFlowBeat.x + Math.sign(offsetX) * step,
      y: lastFlowBeat.y,
      direction: direction,
      marchType: marchType,
    });
  }
};

/**
 * Helper function to march in either north or south (eight to five)
 *
 * @param offsetY    - How many steps to march. Positive is east, negative is
 *                     west.
 * @param direction? - To enforce a direction to face, set this parameter. If
 *                     undefined, the marcher will face the direction they are
 *                     marching.
 */
export const ewHelper = (
  flow: FlowBeat[],
  offsetY: number,
  marchType: MARCH_TYPES,
  direction?: number
): void => {
  if (offsetY === 0) {
    return;
  }
  if (direction === undefined) {
    direction = Math.sign(offsetY) ? DIRECTIONS.E : DIRECTIONS.W;
  }

  const lastFlowBeat = flow[flow.length - 1];
  lastFlowBeat.direction = direction;
  lastFlowBeat.marchType = marchType;

  for (let step = 1; step <= Math.abs(offsetY); step += 1) {
    flow.push({
      x: lastFlowBeat.x,
      y: lastFlowBeat.y + Math.sign(offsetY) * step,
      direction: direction,
      marchType: marchType,
    });
  }
};

/**
 * Helper function to march in a diagonal (eight to five)
 *
 * @param offsetX    - Positive is north, negative is south.
 * @param offsetY    - Positive is east, negative is west.
 * @param direction  - To enforce a direction to face, set this parameter. If
 *                     undefined, the marcher will face the direction they are
 *                     marching.
 */
export const diagonalHelper = (
  flow: FlowBeat[],
  offsetX: number,
  offsetY: number,
  marchType: MARCH_TYPES,
  direction?: number
): void => {
  if (Math.abs(offsetX) !== Math.abs(offsetY)) {
    throw new Error(
      `offsetX (${offsetX}) and offsetY (${offsetY}) are not equal!`
    );
  }
  if (offsetX === 0 && offsetY === 0) {
    return;
  }

  if (direction === undefined) {
    if (Math.sign(offsetX) > 0) {
      direction = Math.sign(offsetY) ? DIRECTIONS.NE : DIRECTIONS.NW;
    } else {
      direction = Math.sign(offsetY) ? DIRECTIONS.SE : DIRECTIONS.SW;
    }
  }

  const lastFlowBeat = flow[flow.length - 1];
  lastFlowBeat.direction = direction;
  lastFlowBeat.marchType = marchType;

  for (let step = 1; step <= Math.abs(offsetX); step += 1) {
    flow.push({
      x: lastFlowBeat.x + Math.sign(offsetX) * step,
      y: lastFlowBeat.y + Math.sign(offsetY) * step,
      direction: direction,
      marchType: marchType,
    });
  }
};
