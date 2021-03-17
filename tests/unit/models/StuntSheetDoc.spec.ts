import StuntSheetDot from "@/models/StuntSheetDot";
import { MARCH_TYPES } from "@/models/util/constants";

describe("models/StuntSheetDot", () => {
  describe("calculateWarningsShallow", () => {
    let dot: StuntSheetDot;

    it("warns if dot flow is empty", () => {
      dot = new StuntSheetDot();
      dot.calculateWarningsShallow(0, 0);
      expect(dot.warnings).toHaveLength(1);
      expect(dot.warnings[0].name).toEqual("Dot Flow Empty");
    });

    it("warns if dot takes too big steps", () => {
      dot = new StuntSheetDot();
      dot.cachedFlow = [
        {
          x: 1,
          y: 1,
          direction: 0,
          marchType: MARCH_TYPES.HS,
        },
        {
          x: 1,
          y: 10,
          direction: 0,
          marchType: MARCH_TYPES.HS,
        },
      ];
      dot.calculateWarningsShallow(0, 0);
      expect(dot.warnings).toHaveLength(1);
      expect(dot.warnings[0].name).toEqual("Step Too Big");
    });
  });
});
