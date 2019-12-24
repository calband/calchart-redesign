import Show from "@/models/Show";
import { ParseCalChart3 } from "@/models/util/ParseCalChart3";

describe('models/util/ParseCalChart3', () => {

  describe('testLoad', () => {
    let show: Show;

    it('simple show', () => {
      const base64_string = "SU5HTEdVMzVTSE9XAAABgFNJWkUAAAAEAAAAAUVORCBTSVpFTEFCTAAAAANBMABFTkQgTEFCTFNIRVQAAACGTkFNRQAAAAIxAEVORCBOQU1FRFVSQQAAAAQAAAAIRU5EIERVUkFQTlRTAAAACAf7AP1gAAAARU5EIFBOVFNDT05UAAAAEkVDTlQAAAACAABFTkQgRUNOVEVORCBDT05UUENOVAAAAAIAAEVORCBQQ05UQkFDSwAAAAQAAAAARU5EIEJBQ0tFTkQgU0hFVFNIRVQAAACLTkFNRQAAAAdzaGVldDIARU5EIE5BTUVEVVJBAAAABAAAAARFTkQgRFVSQVBOVFMAAAAIB/tA/aAAAQBFTkQgUE5UU0NPTlQAAAASRUNOVAAAAAIBAEVORCBFQ05URU5EIENPTlRQQ05UAAAAAgAARU5EIFBDTlRCQUNLAAAABAAAAABFTkQgQkFDS0VORCBTSEVUU0VMRQAAAAQAAAAARU5EIFNFTEVDVVJSAAAABAAAAAFFTkQgQ1VSUkVORCBTSE9X";
      const data_array = Uint8Array.from(atob(base64_string), c => c.charCodeAt(0))
      const show = new ParseCalChart3().ParseShow(data_array.buffer);
      expect(show).not.toBeNull();
      expect(show instanceof Show).toBeTruthy();
      if (show) {
        expect(show.dotLabels.length).toBe(1);
        expect(show.dotLabels).toStrictEqual(["A0"]);
        expect(show.title).toStrictEqual("");
        expect(show.stuntSheets.length).toBe(2);
        expect(show.stuntSheets[0].title).toBe("1");
        expect(show.stuntSheets[1].title).toBe("sheet2");
        expect(show.stuntSheets[0].beats).toBe(8);
        expect(show.stuntSheets[1].beats).toBe(4);
        expect(show.stuntSheets[0].stuntSheetDots.length).toBe(1);
        expect(show.stuntSheets[1].stuntSheetDots.length).toBe(1);
        expect(show.stuntSheets[0].stuntSheetDots[0].x).toBe(0);
        expect(show.stuntSheets[0].stuntSheetDots[0].y).toBe(0);
        expect(show.stuntSheets[1].stuntSheetDots[0].x).toBe(8);
        expect(show.stuntSheets[1].stuntSheetDots[0].y).toBe(8);
      }
    });

  });
});
