/**
 * CalChart3 was a bytestream with a series of 4 char codes describing the next section.
 * In general, the layout is <4char> <size_of_data> <data...> <"END "> <4char>, with
 * the exception of the first "INGL" block and the version
 * the Version block is either "GURK", for CalChart3.0, or "GUXY" where X and Y are version 
 * numbers in hex.
 * 
 * For CalChart 3.3 and later there are consistent 4char blocks that contain more elements
 * of the show.
 */

import Show from '../Show';
import StuntSheet from '../StuntSheet';
import StuntSheetDot from '../StuntSheetDot';

/**
 * LoadShow
 * 
 * @param buffer The Byte array of data to load.
 * @returns Returns either a new [Show] or null if the Byte array is ill-formed.
 */
export default function LoadShow(buffer : ArrayBuffer) {
  try {
    // parsing frequently involves throwing to indicate the parse failed.
    return LoadShowHelper(buffer);
  }
  catch(e) {
    console.log(e);
  }
  return null;
}

function LoadShowHelper(buffer : ArrayBuffer) {
  // first we parse and confirm the file is well formed
  if (!ReadAndCheckID(new DataView(buffer, 0, 4), 0, "INGL")) {
    return null;
  }
  // Extract the version number
  const version = ReadVersion(new DataView(buffer, 4, 4));
  if (version <= 33) {
    console.log('no support for 3.3 or earlier ', version);
    return LoadCalChart33AndEarlier(new DataView(buffer, 8, buffer.byteLength-8));
  }
  return LoadCalChart3Current(new DataView(buffer, 8, buffer.byteLength-8));
}


// Importing calchart 3.3 and earlier is not supported
function LoadCalChart33AndEarlier(buffer: DataView) {
  throw new Error('No support for CalChart 3.3 or ealier');
}

// calchart 3.4 is a series of tables, with each one have the format: name_32, size_32, data, end_32 
function LoadCalChart3Current(buffer: DataView) {
  let show = new Show();
  // doing this here till we resolve #39 Don't set a default title on a new show
  show.title = '';
  show.stuntSheets = [];
  const split = SplitDataViewIntoChunks(buffer);
  for (let block of split) {
    if (block[0] == "SHOW") {
      show = ParseCalChart3SHOW(block);
    }
  }
  return show;
}

function ParseCalChart3SHOW(block: [string, DataView]) {
  let show = new Show();
  // doing this here till we resolve #39 Don't set a default title on a new show
  show.title = '';
  show.stuntSheets = [];
  const split = SplitDataViewIntoChunks(block[1]);
  for (let block of split) {
    if (block[0] == "SIZE") {
      ParseCalChart3SHOWSIZE(show, block);
    }
    if (block[0] == "LABL") {
      ParseCalChart3SHOWLABL(show, block);
    }
    if (block[0] == "DESC") {
      ParseCalChart3SHOWDESC(show, block);
    }
    if (block[0] == "SHET") {
      ParseCalChart3SHOWSHET(show, block);
    }
  }
  return show;
}

function ParseCalChart3SHOWSIZE(show: Show, block: [string, DataView]) {
  if (block[1].byteLength != 4) {
    throw new Error('Show Size field is incorrect');
  }
  show.numberDots = ReadNumber(block[1], 0);
}

function ParseCalChart3SHOWLABL(show: Show, block: [string, DataView]) {
  let labels : string[] = [];

  // what we do is we iterate over the list of data as if they are chars till we've exhausted.
  let offset = 0;
  let currentLabel = '';
  while (offset < block[1].byteLength) {
    const value = block[1].getUint8(offset++);
    if (value) {
      currentLabel += String.fromCharCode(value);
    }
    else {
      labels.push(currentLabel);
      currentLabel = '';
    }
  }
  if (labels.length != show.numberDots || offset != block[1].byteLength) {
    throw new Error('Show Labels is incorrect');
  }
  show.dotLabels = labels;
}

function ParseCalChart3SHOWDESC(show: Show, block: [string, DataView]) {
  show.title = ReadStringTillEnd(block[1], 0);
}

function ParseCalChart3SHOWSHET(show: Show, block: [string, DataView]) {
  let stuntSheet = new StuntSheet();
  const split = SplitDataViewIntoChunks(block[1]);
  for (let block of split) {
    if (block[0] == "NAME") {
      ParseCalChart3SHETNAME(stuntSheet, block);
    }
    if (block[0] == "DURA") {
      ParseCalChart3SHETDURA(stuntSheet, block);
    }
    if (block[0] == "PNTS") {
      ParseCalChart3SHETPNTS(stuntSheet, block);
    }
  }
  show.stuntSheets.push(stuntSheet);
  return;
}

function ParseCalChart3SHETNAME(stuntSheet: StuntSheet, block: [string, DataView]) {
  stuntSheet.title = ReadStringTillEnd(block[1], 0);
}

function ParseCalChart3SHETDURA(stuntSheet: StuntSheet, block: [string, DataView]) {
  stuntSheet.beats = ReadNumber(block[1], 0);
}

function ParseCalChart3SHETPNTS(stuntSheet: StuntSheet, block: [string, DataView]) {
  let dots : StuntSheetDot[] = [];

  // what we do is we iterate over the list of data as if they are chars till we've exhausted.
  let offset = 0;
  while (offset < block[1].byteLength) {
    const pointSize = block[1].getUint8(offset);
    dots.push(ParseCalChart3Point(new DataView(block[1].buffer, block[1].byteOffset + offset + 1, pointSize)));
    offset += pointSize + 1;
  }
  if (offset != block[1].byteLength) {
    throw new Error('Show dots is incorrect');
  }
  stuntSheet.stuntSheetDots = dots;
}

function ParseCalChart3Point(buffer: DataView) {
  let dot = new StuntSheetDot();

  dot.x = CalChart3To4XConvert(ReadInt16Num(buffer, 0));
  dot.y = CalChart3To4YConvert(ReadInt16Num(buffer, 2));

  return dot;
}

function CalChart3To4XConvert(x : number) : number {
  return 160 + x/8;
}

function CalChart3To4YConvert(y : number) : number {
  return 84 + y/8;
}

function ReadFourCharCode(buffer : DataView, offset : number) {
  return String.fromCharCode(buffer.getUint8(offset + 0)) + String.fromCharCode(buffer.getUint8(offset + 1)) + String.fromCharCode(buffer.getUint8(offset + 2)) + String.fromCharCode(buffer.getUint8(offset + 3));
}

function ReadNumber(buffer : DataView, offset : number) {
  return (buffer.getUint8(offset+0)<<24) + (buffer.getUint8(offset+1)<<16) + (buffer.getUint8(offset+2)<<8) + (buffer.getUint8(offset+3)<<0);
}

// this should be a getInt16 call.
function ReadInt16Num(buffer : DataView, offset : number) {
  return (((buffer.getUint8(offset+0)<<8) + (buffer.getUint8(offset+1)<<0))<<16)>>16;
}

function ReadStringTillEnd(buffer : DataView, offset : number) {
  let count = 0;
  let found = '';
  while ((offset + count) < buffer.byteLength) {
    const value = buffer.getUint8(offset + count++);
    if (!value) {
      break;
    }
    found += String.fromCharCode(value);
  }
  if ((offset + count) != buffer.byteLength) {
    throw new Error('String not parsed correctly');
  }
  return found;
}

function ReadAndCheckID(buffer : DataView, offset : number, fourChar : string) {
  return ReadFourCharCode(buffer, offset) == fourChar;
}

function ReadAndCheckID2(buffer : DataView, offset : number, fourChar : string) {
  return buffer.getUint8(offset + 0) == fourChar.charCodeAt(0) &&
      buffer.getUint8(offset + 1) == fourChar.charCodeAt(1);
}

function ReadVersion(buffer : DataView) {
  if (ReadAndCheckID(buffer, 0, "GURK")) {
    return 0;
  }
  if (ReadAndCheckID2(buffer, 0, "GU")) {
    return (buffer.getUint8(2) - "0".charCodeAt(0)) * 10 + buffer.getUint8(3) - "0".charCodeAt(0);
  }
  return 0;
}

// this function takes a data view and returns an array of tuples of [string, data]
function SplitDataViewIntoChunks(buffer : DataView): [string, DataView][] {
  // while we haven't reached the end, split
  var result: [string, DataView][] = [];
  var offset = 0;
  while (offset != buffer.byteLength) {
    const fourChar = ReadFourCharCode(buffer, offset);
    const size = ReadNumber(buffer, offset+4);
    const endConfirmFourChar = ReadFourCharCode(buffer, offset+size+8);
    const endFourChar = ReadFourCharCode(buffer, offset+size+12);
    if (fourChar != endFourChar || endConfirmFourChar != 'END ') {
      console.log('error on parsing.  Section ', fourChar, ' ended with ', endFourChar, endConfirmFourChar);
      // do we throw here?
    }
    result.push([fourChar, new DataView(buffer.buffer, offset + buffer.byteOffset + 8, size)]);
    offset += 16 + size;
  }
  return result;
}


