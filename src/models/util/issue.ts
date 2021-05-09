import Serializable from "./Serializable";

export enum IssueType {
  WARNING = "warning",
  ERROR = "error",
}

/**
 * Defines an issue
 */
export default class Issue extends Serializable<Issue> {
  name = "";
  description = "";
  issueType: IssueType = IssueType.WARNING;
  dots: number[] = [];
  stuntSheets: number[] = [];

  constructor(json: Partial<Issue> = {}) {
    super();
    if (json.name === undefined) {
      json.name = "Empty Issue";
    }
    if (json.issueType === undefined) {
      json.issueType = IssueType.WARNING;
    }
    if (json.stuntSheets === undefined) {
      json.stuntSheets = [];
    }
    if (json.dots === undefined) {
      json.dots = [];
    }
    this.fromJson(json);
  }
}
