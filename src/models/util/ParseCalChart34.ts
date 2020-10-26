/**
 * CalChart3.4 was a bytestream with a series of 4 char codes describing the
 * next section.
 *
 * Most all blocks are generally in the form:
 *
 * {4-char block name} {4-byte size of block} {BlockData} {'E''N''D'' '} {4-char
 * block name}
 *
 * This allows a parser to quickly jump to the end of a block it doesn't know
 * about, to allow for future improvements.
 *
 *   Where {}* means 0 or more;
 *         [] means 0 or 1;
 *         /ignore/ means could contain future blocks that could be ignored.
 *
 * show               = START , SHOW ;
 * START              = INGL_INGL , INGL_VERS ;
 * SHOW               = INGL_SHOW , BigEndianInt32(DataTill_SHOW_END) ,
 *                      SHOW_DATA , SHOW_END ;
 * SHOW_DATA          = NUM_MARCH , LABEL , [ DESCRIPTION ] , { SHEET }* ,
 *                      [ SELECTION ], CURRENT_SHEET, /ignore/ ;
 * SHOW_END           = INGL_END , INGL_SHOW ;
 * NUM_MARCH          = INGL_SIZE , BigEndianInt32(4) , NUM_MARCH_DATA ,
 *                      NUM_MARCH_END ;
 * NUM_MARCH_DATA     = BigEndianInt32( number of marchers ) ;
 * NUM_MARCH_END      = INGL_END , INGL_SIZE ;
 * LABEL              = INGL_LABL , BigEndianInt32(DataTill_LABEL_END) ,
 *                      LABEL_DATA , LABEL_END ;
 * LABEL_DATA         = { Null-terminated_char* }* ;
 * LABEL_END          = INGL_END , INGL_LABL ;
 * DESCRIPTION        = INGL_DESC , BigEndianInt32(DataTill_DESCRIPTION_END) ,
 *                      DESCRIPTION_DATA , DESCRIPTION_END ;
 * DESCRIPTION_DATA   = Null-terminated_char* ;
 * DESCRIPTION_END    = INGL_END , INGL_DESC ;
 * SHEET              = INGL_SHET , BigEndianInt32(DataTill_SHEET_END) ,
 *                      SHEET_DATA , SHEET_END ;
 * SHEET_DATA         = NAME , DURATION , ALL_POINTS , CONTINUITY ,
 *                      PRINT_CONTINUITY , /ignore/ ;
 * SHEET_END          = INGL_END , INGL_SHET ;
 * SELECTION          = INGL_SELE , BigEndianInt32(DataTill_SELECTION_END) ,
 *                      SELECTION_DATA , SELECTION_END ;
 * SELECTION_DATA     = BigEndianInt32(SelectedPoint)* ;
 * SELECTION_END      = INGL_END , INGL_SELE ;
 * CURRENT_SHEET      = INGL_CURR , BigEndianInt32(4) , CURRENT_SHEET_DATA ,
 *                      NUM_MARCH_END ;
 * CURRENT_SHEET_DATA = BigEndianInt32( page selected ) ;
 * CURRENT_SHEET_END  = INGL_END , INGL_CURR ;
 * NAME               = INGL_NAME , BigEndianInt32(DataTill_NAME_END) ,
 *                      NAME_DATA , NAME_END ;
 * NAME_DATA          = Null-terminated_char* ;
 * NAME_END           = INGL_END , INGL_NAME ;
 * DURATION           = INGL_DURA , BigEndianInt32(4) , DURATION_DATA ,
 *                      DURATION_END;
 * DURATION_DATA      = BigEndianInt32(number of beats) ;
 * DURATION_END       = INGL_END , INGL_DURA ;
 * ALL_POINTS         = INGL_PNTS , BigEndianInt32(DataTill_ALL_POINTS_END) ,
 *                      ALL_POINTS_DATA , ALL_POINTS_END ;
 * ALL_POINTS_DATA    = { EACH_POINT_DATA }* ;
 * ALL_POINTS_END     = INGL_END , INGL_PNTS ;
 * EACH_POINT_DATA    = BigEndianInt8(Size_rest_of_EACH_POINT_DATA) ,
 *                      POSITION_DATA , REF_POSITION_DATA , POINT_SYMBOL_DATA ,
 *                      POINT_LABEL_FLIP ;
 * POSITION_DATA      = BigEndianInt16( x ) , BigEndianInt16( y ) ;
 * REF_POSITION_DATA  = BigEndianInt8( num ref pts ) ,
 *                         { BigEndianInt8( which reference point ) ,
 *                           BigEndianInt16( x ) , BigEndianInt16( y ) }* ;
 * POINT_SYMBOL_DATA  = BigEndianInt8( which symbol type ) ;
 * POINT_LABEL_FLIP_DATA = BigEndianInt8( label flipped ) ;
 * CONTINUITY         = INGL_CONT , BigEndianInt32(DataTill_CONTINUITY_END)) ,
 *                      CONTINUITY_DATA , CONTINUITY_END ;
 * CONTINUITY_DATA    = { EACH_CONTINUITY }* ;
 * CONTINUITY_END     = INGL_END , INGL_CONT ;
 * EACH_CONTINUITY    = INGL_ECNT ,
 *                      BigEndianInt32(DataTill_EACH_CONTINUITY_END)) ,
 *                      EACH_CONTINUITY_DATA , EACH_CONTINUITY_END ;
 * EACH_CONTINUITY_DATA = BigEndianInt8( symbol ) , Null-terminated char* ;
 * EACH_CONTINUITY_END  INGL_END , INGL_ECONT ;
 * PRINT_CONTINUITY   = INGL_PCNT ,
 *                      BigEndianInt32(DataTill_PRINT_CONTINUITY_END)) ,
 *                      PRINT_CONTINUITY_DATA , PRINT_CONTINUITY_END ;
 * PRINT_CONTINUITY_DATA = { Null-terminated char* }* ;
 * PRINT_CONTINUITY_END = INGL_END , INGL_PCNT ;
 *
 * INGL_INGL = 'I','N','G','L' ;
 * INGL_GURK = 'G','U','R','K' ;
 * INGL_SHOW = 'S','H','O','W' ;
 * INGL_SHET = 'S','H','E','T' ;
 * INGL_SELE = 'S','E','L','E' ;
 * INGL_SIZE = 'S','I','Z','E' ;
 * INGL_CURR = 'C','U','R','R' ;
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
 */

import Show from "../Show";
import StuntSheet from "../StuntSheet";
import StuntSheetDot from "../StuntSheetDot";
import {
  readInt32,
  readInt16,
  readStringTillEnd,
  readArrayOfStringsTillEnd,
  splitDataViewIntoChunks,
  calChart3To4ConvertX,
  calChart3To4ConvertY,
} from "./ParseCalChart3Utils";
import { ParseCalChart } from "./ParseCalChart";

export class ParseCalChart34 implements ParseCalChart {
  private numberDots = 0;

  ParseShow(inputBuffer: ArrayBuffer): Show {
    // we know the header for a CalChart3.5 show is 8 bytes.  Remove it.
    const buffer = new DataView(inputBuffer, 8, inputBuffer.byteLength - 8);
    const split = splitDataViewIntoChunks(buffer);
    if (split.length !== 1 || split[0][0] !== "SHOW") {
      throw new Error("Cannot find show when parsing CalChart3 file");
    }
    return this.ParseSHOW(split[0][1]);
  }

  ParseSHOW(block: DataView): Show {
    const show = new Show({
      title: "",
      stuntSheets: [],
    });
    const split = splitDataViewIntoChunks(block);

    for (const block of split) {
      switch (block[0]) {
        case "SIZE":
          this.ParseSHOWSIZE(show, block[1]);
          break;
        case "LABL":
          this.ParseSHOWLABL(show, block[1]);
          break;
        case "DESC":
          this.ParseSHOWDESC(show, block[1]);
          break;
        case "SHET":
          this.ParseSHOWSHET(show, block[1]);
          break;
      }
    }
    return show;
  }

  ParseSHOWSIZE(show: Show, block: DataView): void {
    if (block.byteLength !== 4) {
      throw new Error("Show Size incorrect when parsing CalChart3 file");
    }
    this.numberDots = readInt32(block, 0);
  }

  ParseSHOWLABL(show: Show, block: DataView): void {
    const labels = readArrayOfStringsTillEnd(block, 0);
    if (labels.length !== this.numberDots) {
      throw new Error("Show Labels is incorrect when parsing CalChart3 file");
    }
    show.dotLabels = labels;
  }

  ParseSHOWDESC(show: Show, block: DataView): void {
    show.title = readStringTillEnd(block, 0);
  }

  ParseSHOWSHET(show: Show, block: DataView): void {
    const stuntSheet = new StuntSheet();
    const split = splitDataViewIntoChunks(block);
    for (const block of split) {
      if (block[0] === "NAME") {
        this.ParseSHETNAME(stuntSheet, block[1]);
      }
      if (block[0] === "DURA") {
        this.ParseSHETDURA(stuntSheet, block[1]);
      }
      if (block[0] === "PNTS") {
        this.ParseSHETPNTS(stuntSheet, block[1]);
      }
    }
    show.stuntSheets.push(stuntSheet);
  }

  ParseSHETNAME(stuntSheet: StuntSheet, block: DataView): void {
    stuntSheet.title = readStringTillEnd(block, 0);
  }

  ParseSHETDURA(stuntSheet: StuntSheet, block: DataView): void {
    stuntSheet.beats = readInt32(block, 0);
  }

  ParseSHETPNTS(stuntSheet: StuntSheet, block: DataView): void {
    const dots: StuntSheetDot[] = [];

    // keep parsing points till data is exhausted
    let offset = 0;
    let index = 0;
    while (offset < block.byteLength) {
      const pointSize = block.getUint8(offset);
      dots.push(
        this.ParsePoint(
          new DataView(block.buffer, block.byteOffset + offset + 1, pointSize),
          index
        )
      );
      offset += pointSize + 1;
      index += 1;
    }
    if (offset !== block.byteLength) {
      throw new Error("Show dots is incorrect when parsing CalChart3 file");
    }
    stuntSheet.stuntSheetDots = dots;
  }

  ParsePoint(buffer: DataView, labelIndex: number): StuntSheetDot {
    return new StuntSheetDot({
      x: calChart3To4ConvertX(readInt16(buffer, 0)),
      y: calChart3To4ConvertY(readInt16(buffer, 2)),
      dotLabelIndex: labelIndex,
    });
  }
}
