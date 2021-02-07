import InitialShowState from "./InitialShowState";
import { loadShowFromBuffer } from "@/models/util/LoadShow";
import Show from "./Show";

// Increment upon making show metadata changes that break previous versions.
const METADATA_VERSION = 1;

/**
 */
export class InitialLoadShwState extends InitialShowState {
  metadataVersion: number = METADATA_VERSION;

  showData: ArrayBuffer | undefined;

  constructor(json: Partial<InitialLoadShwState> = {}) {
    super();
    this.fromJson(json);
  }

  /**
   * For each StuntSheetDot in the specified StuntSheet, calculate and store
   * the flow based on it's continuities in stuntSheetDot.cachedFlow.
   */
  getInitialState(): Show {
    if (this.showData) {
      return loadShowFromBuffer(this.showData);
    }
    return new Show();
  }
}

/**
 */
export class InitialLoadShw4State extends InitialShowState {
  metadataVersion: number = METADATA_VERSION;

  showData: string | undefined;

  constructor(json: Partial<InitialLoadShw4State> = {}) {
    super();
    this.fromJson(json);
  }

  /**
   * For each StuntSheetDot in the specified StuntSheet, calculate and store
   * the flow based on it's continuities in stuntSheetDot.cachedFlow.
   */
  getInitialState(): Show {
    if (this.showData) {
      return new Show(JSON.parse(this.showData));
    }
    return new Show();
  }
}
