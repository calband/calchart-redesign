/**
 * CalChart3.1 was a bytestream with a series of 4 char codes describing the
 * next section.  It was more complicated than CalChart3.4.
 *
 * Description of the CalChart file format layout, in modified Extended
 * Backus–Naur Form
 * version 3.1.0 to 3.3.5
 * show = START , SHOW ;
 * START = INGL_INGL , INGL_GURK ;
 * SHOW = INGL_SHOW , SIZE , { LABEL } , { DESCRIPTION } , { SHEET } ,
 *        SHOW_END ;
 * SIZE = INGL_SIZE , BigEndianInt32(4) , BigEndianInt32( number of marchers ) ;
 * LABEL = INGL_LABL , BigEndianInt32(Sizeof(LABEL_DATA)) , LABEL_DATA ;
 * LABEL_DATA = { Null-terminated char* } ;
 * DESCRIPTION = INGL_DESC , BigEndianInt32(Sizeof(DESCRIPTION_DATA)) ,
 *               DESCRIPTION_DATA ;
 * DESCRIPTION_DATA = Null-terminated char* ;
 * SHEET = INGL_GURK , INGL_SHET , NAME , DURATION , POSITION ,
 *         [ REF_POSITION ] , [ POINT_SYMBOL ] , [ POINT_CONT_INDEX ] ,
 *         [ POINT_LABEL_FLIP ] ,  CONTINUITY } , SHEET_END ;
 * NAME = INGL_NAME , BigEndianInt32(Sizeof(NAME_DATA)) , NAME_DATA ;
 * NAME_DATA = Null-terminated char* ;
 * DURATION = INGL_DURA , BigEndianInt32(4) , BigEndianInt32(number of beats) ;
 * POSITION = INGL_POS , BigEndianInt32(Sizeof(POSITION_DATA)) , POSITION_DATA ;
 * POSITION_DATA = { BigEndianInt16( x ) , BigEndianInt16( y ) } ;
 * REF_POSITION = INGL_REFP , BigEndianInt32(Sizeof(REF_POSITION_DATA)) ,
 *                                           REF_POSITION_DATA ;
 * REF_POSITION_DATA = BigEndianInt16( which reference point ) ,
 *                     { BigEndianInt16( x ) , BigEndianInt16( y ) } ;
 * POINT_SYMBOL = INGL_SYMB , BigEndianInt32(Sizeof(POINT_SYMBOL_DATA)) ,
 *                POINT_SYMBOL_DATA ;
 * POINT_SYMBOL_DATA = { BigEndianInt8( which symbol type ) } ;
 * POINT_CONT_INDEX = INGL_TYPE , BigEndianInt32(Sizeof(POINT_CONT_INDEX_DATA)),
 *                    POINT_CONT_INDEX_DATA ;
 * POINT_CONT_INDEX_DATA = { BigEndianInt8( which continuity index ) } ;
 * POINT_LABEL_FLIP = INGL_LABL , BigEndianInt32(Sizeof(POINT_LABEL_FLIP_DATA)),
 *                    POINT_LABEL_FLIP_DATA ;
 * POINT_LABEL_FLIP_DATA = { BigEndianInt8( label flipped ) } ;
 * CONTINUITY = INGL_CONT , BigEndianInt32(Sizeof(CONTINUITY_DATA)) ,
 *              CONTINUITY_DATA ;
 * CONTINUITY_DATA = CONTINUITY_INDEX , CONTINUITY_NAME , CONTINUITY_TEXT ;
 * CONTINUITY_INDEX = BigEndianInt8( index );
 * CONTINUITY_NAME = Null-terminated char* ;
 * CONTINUITY_TEXT = Null-terminated char* ;
 * SHEET_END = INGL_END , INGL_SHET ;
 * SHOW_END = INGL_END , INGL_SHOW ;
 * INGL_INGL = 'I','N','G','L' ;
 * INGL_GURK = 'G','U','R','K' ;
 * INGL_SHOW = 'S','H','O','W' ;
 * INGL_SHET = 'S','H','E','T' ;
 * INGL_SIZE = 'S','I','Z','E' ;
 * INGL_LABL = 'L','A','B','L' ;
 * INGL_MODE = 'M','O','D','E' ;
 * INGL_DESC = 'D','E','S','C' ;
 * INGL_NAME = 'N','A','M','E' ;
 * INGL_DURA = 'D','U','R','A' ;
 * INGL_POS  = 'P','O','S',' ' ;
 * INGL_SYMB = 'S','Y','M','B' ;
 * INGL_TYPE = 'T','Y','P','E' ;
 * INGL_REFP = 'R','E','F','P' ;
 * INGL_CONT = 'C','O','N','T' ;
 * INGL_PCNT = 'P','C','N','T' ;
 * INGL_END  = 'E','N','D',' ' ;
 * Some assumptions:
 * strings are ascii 8-bit chars.
 * Error if LABEL_DATA does not contain N null terminated strings, where N ==
 * number of marchers
 * Error if POSITION_DATA does not contain N*2 values, where N == number of
 * marchers
 * Error if REF_POSITION_DATA does not contain N*2 + 1 values, where N == number
 * of marchers
 * Error if POINT_SYMBOL_DATA does not contain N values, where N == number of
 * marchers
 * Error if POINT_CONT_INDEX_DATA does not contain N values, where N == number
 * of marchers
 * Error if POINT_LABEL_FLIP_DATA does not contain N values, where N == number
 * of marchers
 * If REF_POSITION is not supplied, all reference points are assumed to be set
 * to the point value
 * If POINT_SYMBOL is not supplied, all points assumed to be symbol 0
 * If POINT_CONT_INDEX is not supplied, all points assumed to be index 0
 * If POINT_LABEL_FLIP is not supplied, all points assumed to be not flipped
 */

import Show from "../Show";
import StuntSheet from "../StuntSheet";
import StuntSheetDot from "../StuntSheetDot";
import {
  readInt32,
  readInt16,
  readStringTillEnd,
  readArrayOfStringsTillEnd,
  readFourCharCode,
  calChart3To4ConvertX,
  calChart3To4ConvertY,
} from "./ParseCalChart3Utils";
import { ParseCalChart } from "./ParseCalChart";

export class ParseCalChart31 implements ParseCalChart {
  private numberDots = 0;

  ParseShow(inputBuffer: ArrayBuffer): Show {
    // we know the header for a CalChart3.1 show is 8 bytes.  Remove it.
    const buffer = new DataView(inputBuffer, 0, inputBuffer.byteLength);
    // CalChart3.1 is more complicated a format so we parse the blocks inline.
    let offset = 8;
    if (readFourCharCode(buffer, offset) !== "SHOW") {
      throw new Error("Did not find SHOW block");
    }
    offset += 4;

    const show = new Show({
      title: "",
      stuntSheets: [],
    });

    offset = this.ParseSHOWSIZE(show, buffer, offset);
    offset = this.ParseSHOWLABL(show, buffer, offset);
    offset = this.ParseSHOWDESC(show, buffer, offset);
    offset = this.ParseSHOWSHETs(show, buffer, offset);
    return show;
  }

  ParseSHOWSIZE(show: Show, buffer: DataView, offset: number): number {
    if (readFourCharCode(buffer, offset) !== "SIZE") {
      throw new Error("Did not find SIZE block");
    }
    offset += 4;
    if (readInt32(buffer, offset) !== 4) {
      throw new Error("SIZE block incorrect size");
    }
    offset += 4;
    this.numberDots = readInt32(buffer, offset);
    return offset + 4;
  }

  ParseSHOWLABL(show: Show, buffer: DataView, offset: number): number {
    if (readFourCharCode(buffer, offset) !== "LABL") {
      return offset;
    }
    offset += 4;
    const size = readInt32(buffer, offset);
    offset += 4;

    const block = new DataView(buffer.buffer, buffer.byteOffset + offset, size);
    const labels = readArrayOfStringsTillEnd(block, 0);
    if (labels.length !== this.numberDots) {
      throw new Error(
        `Wrong labels. Expected ${this.numberDots}, read ${labels.length}.`
      );
    }
    show.dotLabels = labels;
    return offset + size;
  }

  ParseSHOWDESC(show: Show, buffer: DataView, offset: number): number {
    if (readFourCharCode(buffer, offset) !== "DESC") {
      return offset;
    }
    const size = readInt32(buffer, offset);
    offset += 4;
    const block = new DataView(buffer.buffer, buffer.byteOffset + offset, size);
    show.title = readStringTillEnd(block, 0);
    return offset + size;
  }

  ParseSHOWSHETs(show: Show, buffer: DataView, offset: number): number {
    while (readFourCharCode(buffer, offset) === "GURK") {
      offset += 4;
      offset = this.ParseSHOWSHET(show, buffer, offset);
    }
    return offset;
  }

  ParseSHOWSHET(show: Show, buffer: DataView, offset: number): number {
    if (readFourCharCode(buffer, offset) !== "SHET") {
      throw new Error("Did not find SHET block");
    }
    offset += 4;
    const stuntSheet = new StuntSheet();
    offset = this.ParseSHETNAME(stuntSheet, buffer, offset);
    offset = this.ParseSHETDURA(stuntSheet, buffer, offset);
    offset = this.ParseSHETPOS(stuntSheet, buffer, offset);
    offset = this.ParseSHETREFPs(stuntSheet, buffer, offset);
    offset = this.ParseSHETSYMBs(stuntSheet, buffer, offset);
    offset = this.ParseSHETTYPEs(stuntSheet, buffer, offset);
    offset = this.ParseSHETLABLs(stuntSheet, buffer, offset);
    offset = this.ParseSHETCONTs(stuntSheet, buffer, offset);

    if (readFourCharCode(buffer, offset) !== "END ") {
      throw new Error("Did not find the sheet END");
    }
    offset += 4;
    if (readFourCharCode(buffer, offset) !== "SHET") {
      throw new Error("Did not find the sheet END");
    }
    offset += 4;

    show.stuntSheets.push(stuntSheet);
    return offset;
  }

  ParseSHETNAME(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    const nextSection = readFourCharCode(buffer, offset);
    if (nextSection !== "NAME") {
      throw new Error("Did not find Sheet NAME block");
    }
    offset += 4;
    const size = readInt32(buffer, offset);
    offset += 4;
    const block = new DataView(buffer.buffer, buffer.byteOffset + offset, size);
    stuntSheet.title = readStringTillEnd(block, 0);
    return offset + size;
  }

  ParseSHETDURA(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    if (readFourCharCode(buffer, offset) !== "DURA") {
      throw new Error("Did not find Sheet DURA block");
    }
    offset += 4;
    if (readInt32(buffer, offset) !== 4) {
      throw new Error("DURA block not correct size");
    }
    offset += 4;
    stuntSheet.beats = readInt32(buffer, offset);
    return offset + 4;
  }

  ParseSHETPOS(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    if (readFourCharCode(buffer, offset) !== "POS ") {
      throw new Error("Did not find Sheet POS block");
    }
    offset += 4;
    let numPoints = readInt32(buffer, offset) / 4;
    if (numPoints !== this.numberDots) {
      throw new Error(
        `POS error.  Expecting ${this.numberDots}, received ${numPoints}.`
      );
    }
    offset += 4;
    const dots: StuntSheetDot[] = [];

    // keep parsing points till data is exhausted
    while (numPoints > 0) {
      dots.push(
        new StuntSheetDot({
          x: calChart3To4ConvertX(readInt16(buffer, offset)),
          y: calChart3To4ConvertY(readInt16(buffer, offset + 2)),
        })
      );
      offset += 4;
      --numPoints;
    }
    stuntSheet.stuntSheetDots = dots;
    return offset;
  }

  ParseSHETREFPs(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    while (readFourCharCode(buffer, offset) === "REFP") {
      offset = this.ParseSHETREFP(stuntSheet, buffer, offset);
    }
    return offset;
  }

  ParseSHETREFP(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    if (readFourCharCode(buffer, offset) !== "REFP") {
      return offset;
    }
    offset += 4;
    // references points not implemented.  Just skip for now
    // [#51 Handle ReferencePoints from CalChart3]
    return offset + readInt32(buffer, offset) + 4;
  }

  ParseSHETSYMBs(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    while (readFourCharCode(buffer, offset) === "SYMB") {
      offset = this.ParseSHETSYMB(stuntSheet, buffer, offset);
    }
    return offset;
  }

  ParseSHETSYMB(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    if (readFourCharCode(buffer, offset) !== "SYMB") {
      return offset;
    }
    offset += 4;
    // Symbols not implemented.  Just skip for now
    // [#52 Handle Symbols from CalChart3]
    return offset + readInt32(buffer, offset) + 4;
  }

  ParseSHETTYPEs(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    while (readFourCharCode(buffer, offset) === "TYPE") {
      offset = this.ParseSHETTYPE(stuntSheet, buffer, offset);
    }
    return offset;
  }

  ParseSHETTYPE(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    if (readFourCharCode(buffer, offset) !== "TYPE") {
      return offset;
    }
    offset += 4;
    // Continuity index not implemented.  Just skip for now
    // [#53 Handle Continuity and Continuity Index from CalChart3 files]
    return offset + readInt32(buffer, offset) + 4;
  }

  ParseSHETLABLs(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    while (readFourCharCode(buffer, offset) === "LABL") {
      offset = this.ParseSHETLABL(stuntSheet, buffer, offset);
    }
    return offset;
  }

  ParseSHETLABL(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    if (readFourCharCode(buffer, offset) !== "LABL") {
      return offset;
    }
    offset += 4;
    // Label flip not implemented.  Just skip for now
    // [#54 Handle LabelFlip from CalChart3 files]
    return offset + readInt32(buffer, offset) + 4;
  }

  ParseSHETCONTs(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    while (readFourCharCode(buffer, offset) === "CONT") {
      offset = this.ParseSHETCONT(stuntSheet, buffer, offset);
    }
    return offset;
  }

  ParseSHETCONT(
    stuntSheet: StuntSheet,
    buffer: DataView,
    offset: number
  ): number {
    if (readFourCharCode(buffer, offset) !== "CONT") {
      return offset;
    }
    offset += 4;
    // Continuity translation not implemented.  Just skip for now
    // [#53 Handle Continuity and Continuity Index from CalChart3 files]
    return offset + readInt32(buffer, offset) + 4;
  }
}
