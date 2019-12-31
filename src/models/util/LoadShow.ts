import Show from '../Show';
import { ReadFourCharCode, ReadTwoCharCode } from './ParseCalChartUtils';
import { ParseCalChart } from './ParseCalChart';
import { ParseCalChart3 } from './ParseCalChart3';

// Importing calchart4 is not yet supported
/* eslint-disable @typescript-eslint/no-unused-vars */
function IsCalChart4(buffer: ArrayBuffer): ParseCalChart|null {
  // console.log('no support for CalChart4.0 yet');
  return null;
}
/* eslint-enable @typescript-eslint/no-unused-vars */

function IsCalChart3(buffer: ArrayBuffer): ParseCalChart|null {
  const view = new DataView(buffer, 0, 8);
  // CalChart3 starts with INGLGUxy, where xy is used to determine the version
  if (ReadFourCharCode(view, 0) !== 'INGL'
      || ReadTwoCharCode(view, 4) !== 'GU') {
    return null;
  }

  // Extract the version number.
  const version = ReadTwoCharCode(view, 6);
  // version "RK" is the "GURK" show, which is CalChart 3.1 - 3.3.5.
  if (version === 'RK') {
    // we throw here so the error gets to the user.
    throw 'CalChart 3.3.5 and earlier not supported.';
  }
  // the version is actual encoded as a string, so convert to a number:
  const versionNumber = (version.charCodeAt(0) - '0'.charCodeAt(0)) * 10
                        + version.charCodeAt(1) - '0'.charCodeAt(0);
  if (versionNumber < 34) {
    throw 'CalChart 3.3.5 and earlier not supported.';
  }
  return new ParseCalChart3();
}

/**
 * LoadShow
 *
 * @param buffer The Byte array of data to load.
 * @returns Returns either a new [Show] or will throw an error that can be
 * displayed to the user
 */
export const LoadShow = (buffer: ArrayBuffer): Show => {
  let parser = IsCalChart4(buffer);
  if (parser) {
    return parser.ParseShow(buffer);
  }
  parser = IsCalChart3(buffer);
  if (parser) {
    return parser.ParseShow(buffer);
  }
  throw 'file is not a CalChart show file.';
};

