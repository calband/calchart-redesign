import Deserializable from './util/Deserializable';

/**
 * Defines landmarks needed to determine the size of the field.
 * Defaults to college field measurements.
 * 
 * @property frontHashOffsetY - How many steps from the West sideline the front hash is (used to calculate the field height)
 * @property backHashOffsetY  - How many steps from the West sideline the back hash is (used to calculate the field height)
 * @property middleOfField    - Defines the yard line in the middle (used to calculate the field width)
 */
export default class Field extends Deserializable<Field> {
  frontHashOffsetY: number = 32;

  backHashOffsetY: number = 52;

  middleOfField: number = 50;

  constructor(json: Partial<Field> = {}) {
    super();
    this.fromJson(json);
  }
}
