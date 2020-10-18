/**
 * Functions that determine if a point is within a lasso using the even-odd rule.  See: https://en.wikipedia.org/wiki/Even–odd_rule
 */

/**
 * CrossesLine
 * https://en.wikipedia.org/wiki/Even–odd_rule
 */
function CrossesLine(
  start: [number, number],
  end: [number, number],
  p: [number, number]
): boolean {
  if (start[1] > end[1]) {
    if (!(p[1] <= start[1] && p[1] > end[1])) {
      return false;
    }
  } else {
    if (!(p[1] <= end[1] && p[1] > start[1])) {
      return false;
    }
  }
  return (
    p[0] >=
    ((end[0] - start[0]) * (p[1] - start[1])) / (end[1] - start[1]) + start[0]
  );
}

/**
 * InsideLasso
 *
 * @param lasso Array of points representing a selection lasso.
 * @param point Point to check.
 * @returns Boolean to indicate if the point is inside the lasso.
 */
export const InsideLasso = (
  lasso: [number, number][],
  point: [number, number]
): boolean => {
  // Test if inside polygon using odd-even rule
  let parity = false;
  if (lasso.length < 2) {
    return parity;
  }
  for (let i = 0; i < lasso.length - 1; i++) {
    if (CrossesLine(lasso[i], lasso[i + 1], point)) {
      parity = !parity;
    }
  }
  // don't forget the first one:
  if (CrossesLine(lasso[lasso.length - 1], lasso[0], point)) {
    parity = !parity;
  }

  return parity;
};
