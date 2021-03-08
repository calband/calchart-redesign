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
  dots: number[] = []
  stuntSheet: number | null = null;

  constructor(json: Partial<Warning> = {}) {
    super();
    if (json.name === undefined) {
      json.name = "Empty Warning";
    }
    if (json.warningType === undefined) {
      json.warningType = WarningType.WARNING;
    }
    if (json.stuntSheet === undefined) {
      json.stuntSheet = null;
    }
    if (json.dots === undefined) {
      json.dots = [];
    }
    this.fromJson(json);
  }
}
