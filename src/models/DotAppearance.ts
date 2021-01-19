import Serializable from "./util/Serializable";
/**
 * Defines appearance of a dot
 *
 * @property filled         - Wether the dot is filled
 * @property fill           - The fill color of a dot
 * @property color          - The border color of a dot and its slash
 * @property slashed        - Wether the dot has a slash
 * @property angle          - The angle of the slash
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
