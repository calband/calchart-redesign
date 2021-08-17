import {
  readInt32,
  readInt16,
  readStringTillEnd,
  readArrayOfStringsTillEnd,
  readFourCharCode,
  readTwoCharCode,
  splitDataViewIntoChunks,
  calChart3To4ConvertX,
  calChart3To4ConvertY,
} from "@/models/util/ParseCalChart3Utils";

describe("models/util/ParseCalChart3Utils", () => {
  describe("Testing ParseCalChart3Utils", () => {
    it("read ints", () => {
      const rawArray = Uint8Array.from([1, 2, 3, 4, 5]);
      const data = new DataView(rawArray.buffer);
      expect(readInt16(data, 0)).toBe(258);
      expect(readInt16(data, 1)).toBe(515);
      expect(readInt32(data, 0)).toBe(16909060);
      expect(readInt32(data, 1)).toBe(33752069);
    });

    it("read CharCode", () => {
      const rawArray = Uint8Array.from([65, 66, 67, 68, 69]);
      const data = new DataView(rawArray.buffer);
      expect(readFourCharCode(data, 0)).toBe("ABCD");
      expect(readFourCharCode(data, 1)).toBe("BCDE");
      expect(readTwoCharCode(data, 0)).toBe("AB");
      expect(readTwoCharCode(data, 1)).toBe("BC");
    });

    it("read String", () => {
      const rawArray = Uint8Array.from([65, 66, 67, 68, 0]);
      const data = new DataView(rawArray.buffer);
      expect(readStringTillEnd(data, 0)).toBe("ABCD");
      expect(readStringTillEnd(data, 1)).toBe("BCD");
    });

    it("read String with error", () => {
      const rawArray = Uint8Array.from([65, 66, 67, 0, 69]);
      const data = new DataView(rawArray.buffer);
      expect(() => {
        readStringTillEnd(data, 0);
      }).toThrow("String not parsed correctly");
    });

    it("read array of Strings", () => {
      const rawArray = Uint8Array.from([65, 66, 0, 68, 69, 0]);
      const data = new DataView(rawArray.buffer);
      const array1 = readArrayOfStringsTillEnd(data, 0);
      expect(array1.length).toBe(2);
      expect(array1[0]).toBe("AB");
      expect(array1[1]).toBe("DE");
      const array2 = readArrayOfStringsTillEnd(data, 1);
      expect(array2.length).toBe(2);
      expect(array2[0]).toBe("B");
      expect(array2[1]).toBe("DE");
      const array3 = readArrayOfStringsTillEnd(data, 2);
      expect(array3.length).toBe(2);
      expect(array3[0]).toBe("");
      expect(array3[1]).toBe("DE");
      const array4 = readArrayOfStringsTillEnd(data, 3);
      expect(array4.length).toBe(1);
      expect(array4[0]).toBe("DE");
    });

    it("read array of Strings with errors", () => {
      const rawArray = Uint8Array.from([65, 66, 0, 68, 69, 0, 71]);
      const data = new DataView(rawArray.buffer);
      expect(() => {
        readArrayOfStringsTillEnd(data, 0);
      }).toThrow("Label did not end with \\0");
    });

    it("test splitter", () => {
      // create data that is 'ABCD', 1, 100, 'END ', 'ABCD', 'EFGH', 2, 1500, 'END ', 'EFGH',
      const rawArray = Uint8Array.from([
        65, 66, 67, 68, 0, 0, 0, 1, 100, 69, 78, 68, 32, 65, 66, 67, 68, 69, 70,
        71, 72, 0, 0, 0, 2, 5, 220, 69, 78, 68, 32, 69, 70, 71, 72,
      ]);
      const data = new DataView(rawArray.buffer);
      const array1 = splitDataViewIntoChunks(data);
      expect(array1.length).toBe(2);
      expect(array1[0][0]).toBe("ABCD");
      expect(array1[1][0]).toBe("EFGH");
      expect(array1[0][1].byteLength).toBe(1);
      expect(array1[0][1].getUint8(0)).toBe(100);
      expect(array1[1][1].byteLength).toBe(2);
      expect(array1[1][1].getUint8(0)).toBe(5);
      expect(array1[1][1].getUint8(1)).toBe(220);
    });

    it("test splitter with errors", () => {
      // change END  to FND
      const rawArray1 = Uint8Array.from([
        65, 66, 67, 68, 0, 0, 0, 1, 100, 70, 78, 68, 32, 65, 66, 67, 68, 69, 70,
        71, 72, 0, 0, 0, 2, 5, 220, 69, 78, 68, 32, 69, 70, 71, 72,
      ]);
      let data = new DataView(rawArray1.buffer);
      expect(() => {
        splitDataViewIntoChunks(data);
      }).toThrow("Section ABCD ended with ABCD FND ");

      // make a data section too long
      const rawArray2 = Uint8Array.from([
        65, 66, 67, 68, 0, 0, 0, 2, 100, 69, 78, 68, 32, 65, 66, 67, 68, 69, 70,
        71, 72, 0, 0, 0, 2, 5, 220, 69, 78, 68, 32, 69, 70, 71, 72,
      ]);
      data = new DataView(rawArray2.buffer);
      expect(() => {
        splitDataViewIntoChunks(data);
      }).toThrow("Section ABCD ended with BCDE ND A");

      // end the datablob in the middle
      const rawArray3 = Uint8Array.from([65, 66, 67, 68, 0, 0, 0, 1, 100, 69]);
      data = new DataView(rawArray3.buffer);
      expect(() => {
        splitDataViewIntoChunks(data);
      }).toThrow("Offset is outside the bounds of the DataView");
    });

    it.each([
      [128, 104],
      [-256, 80],
      [0, 96],
    ])("calChart3To4ConvertX(%i) = %i", (input: number, output: number) => {
      expect(calChart3To4ConvertX(input)).toBe(output);
    });

    it.each([
      [128, 50],
      [-256, 26],
      [0, 42],
    ])("calChart3To4ConvertY(%i) = %i", (input: number, output: number) => {
      expect(calChart3To4ConvertY(input)).toBe(output);
    });
  });
});
