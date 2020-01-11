export function readFourCharCode(buffer: DataView, offset: number): string {
  return String.fromCharCode(
    buffer.getUint8(offset + 0),
    buffer.getUint8(offset + 1),
    buffer.getUint8(offset + 2),
    buffer.getUint8(offset + 3)
  );
}

export function readTwoCharCode(buffer: DataView, offset: number): string {
  return String.fromCharCode(
    buffer.getUint8(offset + 0),
    buffer.getUint8(offset + 1)
  );
}

export function readInt32(buffer: DataView, offset: number): number {
  return buffer.getInt32(offset);
}

export function readInt16(buffer: DataView, offset: number): number {
  return buffer.getInt16(offset);
}

export function readStringTillEnd(buffer: DataView, offset: number): string {
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
readArrayOfStringsTillEnd(buffer: DataView, offset: number): string[] {
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
splitDataViewIntoChunks(buffer: DataView): [string, DataView][] {
  // while we haven't reached the end, split
  const retVal: [string, DataView][] = [];
  let offset = 0;
  while (offset !== buffer.byteLength) {
    const fourChar = readFourCharCode(buffer, offset);
    const size = readInt32(buffer, offset+4);
    const endCode = readFourCharCode(buffer, offset+size+8);
    const endFourChar = readFourCharCode(buffer, offset+size+12);
    if (fourChar !== endFourChar || endCode !== 'END ') {
      throw `error.  Section ${fourChar} ended with ${endFourChar} ${endCode}`;
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

export function calChart3To4ConvertX(x: number): number {
  return 160 + x/8;
}

export function calChart3To4ConvertY(y: number): number {
  return 84 + y/8;
}

