export function ReadFourCharCode(buffer: DataView, offset: number): string {
  return String.fromCharCode(
    buffer.getUint8(offset + 0),
    buffer.getUint8(offset + 1),
    buffer.getUint8(offset + 2),
    buffer.getUint8(offset + 3)
  );
}

export function ReadTwoCharCode(buffer: DataView, offset: number): string {
  return String.fromCharCode(
    buffer.getUint8(offset + 0),
    buffer.getUint8(offset + 1)
  );
}

export function ReadInt32(buffer: DataView, offset: number): number {
  return buffer.getInt32(offset);
}

export function ReadInt16(buffer: DataView, offset: number): number {
  return buffer.getInt16(offset);
}

export function ReadStringTillEnd(buffer: DataView, offset: number): string {
  let retVal = '';
  while (offset < buffer.byteLength) {
    const value = buffer.getUint8(offset++);
    if (!value) {
      break;
    }
    retVal += String.fromCharCode(value);
  }
  if (offset !== buffer.byteLength) {
    throw 'String not parsed correctly';
  }
  return retVal;
}

export function
ReadArrayOfStringsTillEnd(buffer: DataView, offset: number): string[] {
  const retVal: string[] = [];

  let currentLabel = '';
  while (offset < buffer.byteLength) {
    const value = buffer.getUint8(offset++);
    if (value) {
      currentLabel += String.fromCharCode(value);
    } else {
      retVal.push(currentLabel);
      currentLabel = '';
    }
  }
  if (offset !== buffer.byteLength) {
    throw 'Error parsing strings from block';
  }
  return retVal;
}

/** 
 * Each chunk is formatted as such:
 * <4char> <size_of_data> <data...> <"END "> <4char>
 * The beginning and end 4char describes what the data represents.
 */
export function
SplitDataViewIntoChunks(buffer: DataView): [string, DataView][] {
  // while we haven't reached the end, split
  const retVal: [string, DataView][] = [];
  let offset = 0;
  while (offset !== buffer.byteLength) {
    const fourChar = ReadFourCharCode(buffer, offset);
    const size = ReadInt32(buffer, offset+4);
    const endConfirmFourChar = ReadFourCharCode(buffer, offset+size+8);
    const endFourChar = ReadFourCharCode(buffer, offset+size+12);
    if (fourChar !== endFourChar || endConfirmFourChar !== 'END ') {
      throw 'error on parsing.  Section ' + fourChar
            + ' ended with ' + endFourChar + endConfirmFourChar;
    }
    retVal.push([fourChar, new DataView(
      buffer.buffer,
      offset + buffer.byteOffset + 8,
      size
    )]);
    offset += 16 + size;
  }
  return retVal;
}

export function CalChart3To4ConvertX(x: number): number {
  return 160 + x/8;
}

export function CalChart3To4ConvertY(y: number): number {
  return 84 + y/8;
}

