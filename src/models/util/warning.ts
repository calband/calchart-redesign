import Serializable from "./Serializable";

export enum WarningType {
  WARNING = "warning",
  ERROR = "error",
}

/**
 * Defines a warning
 */
export default class Warning extends Serializable<Warning> {
  name = "";
  description = "";
  warningType: WarningType = WarningType.WARNING;

  constructor(json: Partial<Warning> = {}) {
    super();
    if (json.name === undefined) {
      json.name = "Empty Warning";
    }
    if (json.warningType === undefined) {
      json.warningType = WarningType.WARNING;
    }
    this.fromJson(json);
  }
}
