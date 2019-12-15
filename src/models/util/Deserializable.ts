/**
 * Extending this class allows it to be constructed from JSON (VueX or shw file)
 * 
 * Note that when loaded from JSON, all class properties that have a class as the type
 * must be initialized again to use it's class methods. This is intended for:
 * - Running a class method on an item in VueX store
 * - Loading data from a show file
 */
export default class Deserializable<T extends Object> {
  fromJson(json: Partial<T> = {}): void {
    Object.assign(this, json);
  }
}
