/**
 * Defines landmarks needed to determine the size of the field.
 * Defaults to college field measurements.
 */
export default class Field {
  frontHashOffsetY: number;

  backHashOffsetY: number;

  middleOfField: number;

  constructor() {
    this.frontHashOffsetY = 32;
    this.backHashOffsetY = 52;
    this.middleOfField = 50;
  }
}
