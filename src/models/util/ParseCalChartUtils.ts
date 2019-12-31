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
  let count = 0;
  let found = '';
  while (offset + count < buffer.byteLength) {
    const value = buffer.getUint8(offset + count++);
    if (!value) {
      break;
    }
    found += String.fromCharCode(value);
  }
  if (offset + count !== buffer.byteLength) {
    throw 'String not parsed correctly';
  }
  return found;
}

export function
ReadArrayOfStringsTillEnd(buffer: DataView, offset: number): string[] {
  const labels: string[] = [];

  let currentLabel = '';
  while (offset < buffer.byteLength) {
    const value = buffer.getUint8(offset++);
    if (value) {
      currentLabel += String.fromCharCode(value);
    } else {
      labels.push(currentLabel);
      currentLabel = '';
    }
  }
  if (offset !== buffer.byteLength) {
    throw 'Error parsing strings from block';
  }
  return labels;
}

// takes a data view and returns an array of tuples of [string, data]
export function
SplitDataViewIntoChunks(buffer: DataView): [string, DataView][] {
  // while we haven't reached the end, split
  const result: [string, DataView][] = [];
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
    result.push([fourChar, new DataView(
      buffer.buffer,
      offset + buffer.byteOffset + 8,
      size
    )]);
    offset += 16 + size;
  }
  return result;
}

export function CalChart3To4XConvert(x: number): number {
  return 160 + x/8;
}

export function CalChart3To4YConvert(y: number): number {
  return 84 + y/8;
}

