import Show from "../Show";
import { readFourCharCode, readTwoCharCode } from "./ParseCalChart3Utils";
import { ParseCalChart } from "./ParseCalChart";
import { ParseCalChart31 } from "./ParseCalChart31";
import { ParseCalChart34 } from "./ParseCalChart34";

// Importing calchart4 is not yet supported
/* eslint-disable @typescript-eslint/no-unused-vars */
function IsCalChart4(buffer: ArrayBuffer): ParseCalChart | null {
  return null;
}

function IsCalChart3(buffer: ArrayBuffer): ParseCalChart | null {
  const view = new DataView(buffer, 0, 8);
  // CalChart3 starts with INGLGUxy, where xy is used to determine the version
  if (
    readFourCharCode(view, 0) !== "INGL" ||
    readTwoCharCode(view, 4) !== "GU"
  ) {
    return null;
  }

  // Extract the version number.
  const version = readTwoCharCode(view, 6);
  // version "RK" is the "GURK" show, which is CalChart 3.1 - 3.3.5.
  if (version === "RK") {
    return new ParseCalChart31();
  }
  // the version is actual encoded as a string, so convert to a number:
  const versionNumber =
    (version.charCodeAt(0) - "0".charCodeAt(0)) * 10 +
    version.charCodeAt(1) -
    "0".charCodeAt(0);
  if (versionNumber < 34) {
    return new ParseCalChart31();
  }
  return new ParseCalChart34();
}

/**
 * loadShowFromBuffer
 *
 * @param buffer The Byte array of data to load.
 * @returns Returns either a new [Show] or will throw an error that can be
 * displayed to the user
 */
export const loadShowFromBuffer = (buffer: ArrayBuffer): Show => {
  let parser = IsCalChart4(buffer);
  if (parser) {
    return parser.ParseShow(buffer);
  }
  parser = IsCalChart3(buffer);
  if (parser) {
    return parser.ParseShow(buffer);
  }
  throw new Error("file is not a CalChart show file.");
};
