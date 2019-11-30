/**
 * Defines landmarks needed to determine the size of the field.
 * Defaults to college field measurements.
 * 
 * @property frontHashOffsetY - How many steps from the West sideline the front hash is (used to calculate the field height)
 * @property backHashOffsetY  - How many steps from the West sideline the back hash is (used to calculate the field height)
 * @property middleOfField    - Defines the yard line in the middle (used to calculate the field width)
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
