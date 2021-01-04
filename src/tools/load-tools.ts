import BaseTool, { TOOL_IDS } from "./BaseTool";
import ToolBoxSelect from "./ToolBoxSelect";
import ToolLassoSelect from "./ToolLassoSelect";
import ToolSingleDot from "./ToolSingleDot";

export const loadTool = (toolJson: BaseTool) => {
  switch (toolJson.toolId) {
    case TOOL_IDS.BOX_SELECT:
      return new ToolBoxSelect();
    
    case TOOL_IDS.LASSO_SELECT:
      return new ToolLassoSelect();

    case TOOL_IDS.SINGLE_DOT:
      return new ToolSingleDot();
  }
};
