import Show from "@/models/Show";
import StuntSheet from '@/models/StuntSheet';
import ContinuityEightToFiveDynamic from '@/models/continuity/ContinuityEightToFiveDynamic';
import ContinuityInPlace from '@/models/continuity/ContinuityInPlace';
import StuntSheetDot from '@/models/StuntSheetDot';
import { MARCH_TYPES } from '@/models/util/constants';
import { FlowBeat } from '@/models/util/types';

// Mock ContinuityEightToFiveDynamic to add the start and end dot positions to the flow
jest.mock('@/models/continuity/ContinuityEightToFiveDynamic', () => {
  return jest.fn().mockImplementation((_, marchType: MARCH_TYPES) => {
    return {
      addToFlow: jest.fn().mockImplementation((flow: FlowBeat[], startDot: StuntSheetDot, endDot?: StuntSheetDot) => {
        if (endDot === undefined) return;
        flow.push(
          {
            x: startDot.x,
            y: startDot.y,
            direction: 45,
            marchType: marchType
          },
          {
            x: endDot.x,
            y: endDot.y,
            direction: 45,
            marchType: marchType
          },
        );
      })
    }
  });
});

// Mock ContinuityInPlace to add the start dot position to the flow
jest.mock('@/models/continuity/ContinuityInPlace', () => {
  return jest.fn().mockImplementation((_, direction: number, marchType: MARCH_TYPES) => {
    return {
      addToFlow: jest.fn().mockImplementation((flow: FlowBeat[], startDot: StuntSheetDot) => {
        flow.push({
          x: startDot.x,
          y: startDot.y,
          direction: direction,
          marchType: marchType
        });
      })
    }
  });
});

describe('models/Show', () => {
  describe('generateFlows', () => {
    let show: Show;

    beforeAll(() => {
      show = new Show();
      show.dotLabels = ['A0', 'A1', 'A2'];
      
      const startSS: StuntSheet = new StuntSheet();
      startSS.stuntSheetDots = [
        new StuntSheetDot(0, 0, 0),
        new StuntSheetDot(2, 2, 1),
        new StuntSheetDot(4, 4, 2)
      ];
      startSS.stuntSheetDots[2].dotTypeIndex = 1;
  
      startSS.dotTypes = [
        [
          new ContinuityEightToFiveDynamic(0, MARCH_TYPES.HS),
          new ContinuityInPlace(0, 90, MARCH_TYPES.HS)
        ],
        [
          new ContinuityInPlace(2, 180, MARCH_TYPES.HS),
          new ContinuityEightToFiveDynamic(0, MARCH_TYPES.HS),
          new ContinuityInPlace(0, 270, MARCH_TYPES.HS)
        ]
      ];
  
      const endSS: StuntSheet = new StuntSheet();
      endSS.stuntSheetDots = [
        new StuntSheetDot(2, 2, 0),
        new StuntSheetDot(4, 4, 1),
        new StuntSheetDot(6, 6, 2)
      ];
  
      show.stuntSheets = [startSS, endSS];
  
      show.generateFlows(0);
    });

    it('First dot type calls all continuities for the two dots', () => {
      const firstDotType = show.stuntSheets[0].dotTypes[0];
      expect(firstDotType[0].addToFlow).toHaveBeenCalledTimes(2);
      expect(firstDotType[1].addToFlow).toHaveBeenCalledTimes(2);
    });

    it('Second dot type calls all continuities for the one dot', () => {
      const secondDotType = show.stuntSheets[0].dotTypes[1];
      expect(secondDotType[0].addToFlow).toHaveBeenCalledTimes(1);
      expect(secondDotType[1].addToFlow).toHaveBeenCalledTimes(1);
      expect(secondDotType[2].addToFlow).toHaveBeenCalledTimes(1);
    });

    it('First dot has correct cachedFlow', () => {
      const firstStartDot: StuntSheetDot = show.stuntSheets[0].stuntSheetDots[0];
      expect(firstStartDot.cachedFlow).toStrictEqual([
        {
          x: 0,
          y: 0,
          direction: 45,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 2,
          y: 2,
          direction: 45,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 0,
          y: 0,
          direction: 90,
          marchType: MARCH_TYPES.HS
        },
      ]);
    });

    it('Second dot has correct cachedFlow', () => {
      const secondStartDot: StuntSheetDot = show.stuntSheets[0].stuntSheetDots[1];
      expect(secondStartDot.cachedFlow).toStrictEqual([
        {
          x: 2,
          y: 2,
          direction: 45,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 4,
          y: 4,
          direction: 45,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 2,
          y: 2,
          direction: 90,
          marchType: MARCH_TYPES.HS
        },
      ]);
    });

    it('Third dot has correct cachedFlow', () => {
      const thirdStartDot: StuntSheetDot = show.stuntSheets[0].stuntSheetDots[2];
      const thirdEndDot: StuntSheetDot = show.stuntSheets[1].stuntSheetDots[2];
      expect(thirdStartDot.cachedFlow).toStrictEqual([
        {
          x: 4,
          y: 4,
          direction: 180,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 4,
          y: 4,
          direction: 45,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 6,
          y: 6,
          direction: 45,
          marchType: MARCH_TYPES.HS
        },
        {
          x: 4,
          y: 4,
          direction: 270,
          marchType: MARCH_TYPES.HS
        },
      ]);
    });

  });
});