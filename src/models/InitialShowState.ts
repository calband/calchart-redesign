import Serializable from "./util/Serializable";
import Show from "./Show";

// Increment upon making show metadata changes that break previous versions.
const METADATA_VERSION = 1;

/**
 * Defines an object that creates the initial state of a show for Undo system.
 * This way when we save and restore CalChart we have a way to always get back
 * to the orignal starting point.
 *
 * Initializing a show state for a new show from scratch is the default.  This
 * can be extended to load shows from other locations, like an array buffer
 * representing a show from a previous version of CalChart.
 */
export default class InitialShowState extends Serializable<InitialShowState> {
  metadataVersion: number = METADATA_VERSION;

  constructor(json: Partial<InitialShowState> = {}) {
    super();
    this.fromJson(json);
  }

  /**
   * For each StuntSheetDot in the specified StuntSheet, calculate and store
   * the flow based on it's continuities in stuntSheetDot.cachedFlow.
   */
  getInitialState(): Show {
    return new Show();
  }
}
