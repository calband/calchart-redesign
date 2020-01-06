/**
 * CalChart3 was a bytestream with a series of 4 char codes describing the next
 * section.  In general, the layout is:
 *  <4char> <size_of_data> <data...> <"END "> <4char>
 * with the exception of the first "INGL" block and the version the Version
 * block is either "GURK", for CalChart3.0, or "GUXY" where X and Y are version
 * numbers in hex.
 *
 * For CalChart 3.3 and later there are consistent 4char blocks that contain
 * more elements of the show.
 */

import Show from '../Show';
import StuntSheet from '../StuntSheet';
import StuntSheetDot from '../StuntSheetDot';
import { ReadInt32,
  ReadInt16,
  ReadStringTillEnd,
  ReadArrayOfStringsTillEnd,
  SplitDataViewIntoChunks,
  CalChart3To4ConvertX,
  CalChart3To4ConvertY } from './ParseCalChartUtils';
import { ParseCalChart } from './ParseCalChart';

// calchart 3.4 is a series of tables, with each one have the format: name_32,
// size_32, data, end_32
export class ParseCalChart3 implements ParseCalChart {
  private numberDots: number = 0;

  ParseShow(inputBuffer: ArrayBuffer): Show {
    // we know the header for a CalChart3.5 show is 8 bytes.  Remove it.
    const buffer = new DataView(inputBuffer, 8, inputBuffer.byteLength-8);
    const split = SplitDataViewIntoChunks(buffer);
    if (split.length !== 1 || split[0][0] !== 'SHOW') {
      throw 'Cannot find show when parsing CalChart3 file';
    }
    return this.ParseCalChart3SHOW(split[0][1]);
  }

  ParseCalChart3SHOW(block: DataView): Show {
    const show = new Show({
      title: '',
      stuntSheets: [],
    });
    const split = SplitDataViewIntoChunks(block);

    for (const block of split) {
      if (block[0] === 'SIZE') {
        this.ParseCalChart3SHOWSIZE(show, block[1]);
      }
      if (block[0] === 'LABL') {
        this.ParseCalChart3SHOWLABL(show, block[1]);
      }
      if (block[0] === 'DESC') {
        this.ParseCalChart3SHOWDESC(show, block[1]);
      }
      if (block[0] === 'SHET') {
        this.ParseCalChart3SHOWSHET(show, block[1]);
      }
    }
    return show;
  }

  ParseCalChart3SHOWSIZE(show: Show, block: DataView): void {
    if (block.byteLength !== 4) {
      throw 'Show Size incorrect when parsing CalChart3 file';
    }
    this.numberDots = ReadInt32(block, 0);
  }

  ParseCalChart3SHOWLABL(show: Show, block: DataView): void {
    const labels = ReadArrayOfStringsTillEnd(block, 0);
    if (labels.length !== this.numberDots) {
      throw 'Show Labels is incorrect when parsing CalChart3 file';
    }
    show.dotLabels = labels;
  }

  ParseCalChart3SHOWDESC(show: Show, block: DataView): void {
    show.title = ReadStringTillEnd(block, 0);
  }

  ParseCalChart3SHOWSHET(show: Show, block: DataView): void {
    const stuntSheet = new StuntSheet();
    const split = SplitDataViewIntoChunks(block);
    for (const block of split) {
      if (block[0] === 'NAME') {
        this.ParseCalChart3SHETNAME(stuntSheet, block[1]);
      }
      if (block[0] === 'DURA') {
        this.ParseCalChart3SHETDURA(stuntSheet, block[1]);
      }
      if (block[0] === 'PNTS') {
        this.ParseCalChart3SHETPNTS(stuntSheet, block[1]);
      }
    }
    show.stuntSheets.push(stuntSheet);
  }

  ParseCalChart3SHETNAME(stuntSheet: StuntSheet, block: DataView): void {
    stuntSheet.title = ReadStringTillEnd(block, 0);
  }

  ParseCalChart3SHETDURA(stuntSheet: StuntSheet, block: DataView): void {
    stuntSheet.beats = ReadInt32(block, 0);
  }

  ParseCalChart3SHETPNTS(stuntSheet: StuntSheet, block: DataView): void {
    const dots: StuntSheetDot[] = [];

    // keep parsing points till data is exhausted
    let offset = 0;
    while (offset < block.byteLength) {
      const pointSize = block.getUint8(offset);
      dots.push(this.ParseCalChart3Point(new DataView(
        block.buffer,
        block.byteOffset + offset + 1, pointSize
      )));
      offset += pointSize + 1;
    }
    if (offset !== block.byteLength) {
      throw 'Show dots is incorrect when parsing CalChart3 file';
    }
    stuntSheet.stuntSheetDots = dots;
  }

  ParseCalChart3Point(buffer: DataView): StuntSheetDot {
    return new StuntSheetDot({
      x: CalChart3To4ConvertX(ReadInt16(buffer, 0)),
      y: CalChart3To4ConvertY(ReadInt16(buffer, 2)),
    });
  }
}


