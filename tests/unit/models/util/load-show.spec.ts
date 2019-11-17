import Show from "@/models/Show";
import { showReviver, typeHelper, typeArrayHelper } from '@/models/util/load-show';
import Field from '@/models/Field';
import StuntSheet from '@/models/StuntSheet';
import StuntSheetDot from '@/models/StuntSheetDot';
import ContinuityInPlace from '@/models/continuity/ContinuityInPlace';
import { DIRECTIONS, MARCH_TYPES } from '@/models/util/constants';
import ContinuityEightToFiveDynamic, { EIGHT_TO_FIVE_DYNAMIC_TYPES } from '@/models/continuity/ContinuityEightToFiveDynamic';

describe('models/util/load-show', () => {
  let show: Show;
  let showJson: string;

  beforeEach(() => {
    show = new Show();
    show.stuntSheets = [new StuntSheet()];
    show.stuntSheets[0].dotTypes = [[
      new ContinuityInPlace(8, DIRECTIONS.E, MARCH_TYPES.MINI_MILITARY),
      new ContinuityEightToFiveDynamic(EIGHT_TO_FIVE_DYNAMIC_TYPES.EWNS, MARCH_TYPES.HS)
    ]];
    show.stuntSheets[0].stuntSheetDots = [new StuntSheetDot(0, 0)];
    showJson = JSON.stringify(show);
  });

  it('typeHelper returns an object with correct type', () => {
    const field: Field = new Field();
    const fieldJson: string = JSON.stringify(field);
    const fieldParsedWithoutHelper: Object = JSON.parse(fieldJson);
    expect(fieldParsedWithoutHelper instanceof Field).toBeFalsy();
    const fieldParsed: Object = typeHelper(fieldParsedWithoutHelper, Field.prototype);
    expect(fieldParsed instanceof Field).toBeTruthy();
  });

  it('typeArrayHelper returns an array with the correct type', () => {
    const stuntSheetDots: StuntSheetDot[] = [new StuntSheetDot(0, 0), new StuntSheetDot(2, 2)];
    const stuntSheetDotsJson: string = JSON.stringify(stuntSheetDots);
    const parsedWithoutHelper: Object[] = JSON.parse(stuntSheetDotsJson);
    expect(parsedWithoutHelper instanceof Array).toBeTruthy();
    parsedWithoutHelper.forEach((dot: Object) => {
      expect(dot instanceof StuntSheetDot).toBeFalsy();
    });
    const parsed = typeArrayHelper(parsedWithoutHelper, StuntSheetDot.prototype);
    expect(parsed instanceof Array).toBeTruthy();
    parsed.forEach((dot: Object) => {
      expect(dot instanceof StuntSheetDot).toBeTruthy();
    });
  });

  it('loads show from json string with correct types', () => {
    const showParsed: Show = JSON.parse(showJson, showReviver);
    expect(showParsed.field instanceof Field).toBeTruthy();
    expect(showParsed.stuntSheets instanceof Array).toBeTruthy();
    expect(showParsed.stuntSheets[0] instanceof StuntSheet).toBeTruthy();
    expect(showParsed.stuntSheets[0].dotTypes instanceof Array).toBeTruthy();
    expect(showParsed.stuntSheets[0].dotTypes[0] instanceof Array).toBeTruthy();
    expect(showParsed.stuntSheets[0].dotTypes[0][0] instanceof ContinuityInPlace).toBeTruthy();
    expect(showParsed.stuntSheets[0].dotTypes[0][1] instanceof ContinuityEightToFiveDynamic).toBeTruthy();
    expect(showParsed.stuntSheets[0].stuntSheetDots instanceof Array).toBeTruthy();
    expect(showParsed.stuntSheets[0].stuntSheetDots[0] instanceof StuntSheetDot).toBeTruthy();
  });
});