import Serializable from "./util/Serializable";
/**
 * Defines appearance of a dot
 *
 * @property filled 
 * @property fill
 * @property color
 * @property fwSlash
 * @property bwSlash
 */
export default class DotAppearance extends Serializable<DotAppearance> {
  filled = true;
  fill = "black";
  color = "black";
  fwSlash = false;
  bwSlash = false;

  constructor(json: Partial<DotAppearance> = {}) {
    super();
    this.fromJson(json);
  }
}
