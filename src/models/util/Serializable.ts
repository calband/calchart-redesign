/* eslint @typescript-eslint/no-explicit-any: "off" */
/**
 * Extending this class allows it to be constructed from JSON
 *
 * Note that when loaded from JSON, all class properties that have a class as the type
 * must be initialized again to use it's class methods.
 *
 * See the unit tests for an example of how to use this.
 */
export default class Serializable<T extends Record<string, any>> {
  fromJson(json: Partial<T> = {}): void {
    Object.assign(this, json);
  }
}
