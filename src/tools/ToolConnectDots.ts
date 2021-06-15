import { ToastProgrammatic as Toast } from "buefy";
import { BNoticeComponent } from "buefy/types/components";
import BaseMoveTool from "./BaseMoveTool";
import BaseTool, { ToolConstructor } from "./BaseTool";
import { GlobalStore } from "@/store";
import { Mutations } from "@/store/mutations";

/**
 * Connect dots between stuntsheets. This tool is performed in 2 steps:
 * 1. Select a dot in the current stuntsheet
 * 2. Select a dot in the next stuntsheet to connect to
 */
const ToolConnectDots: ToolConstructor = class ToolConnectDots extends BaseMoveTool {
  private toast: BNoticeComponent | undefined;

  constructor() {
    super();
    GlobalStore.commit(Mutations.CLEAR_SELECTED_DOTS);
    this.openToast(
      "Connect Dots tool activated. Select a dot from the current stuntsheet."
    );
  }

  onMouseUpInternal(event: MouseEvent): void {
    const { selectedDotIds, show, selectedSS } = GlobalStore.state;
    if (selectedDotIds.length === 1) {
      const nextSSDot = BaseTool.findNextSSDotAtEvent(event);
      if (nextSSDot) {
        const stuntSheetDots = show.stuntSheets[selectedSS].stuntSheetDots;
        const prevConnectedDot = stuntSheetDots.find(
          (dot) => dot.nextDotId === nextSSDot.id
        );
        if (prevConnectedDot) {
          GlobalStore.commit(Mutations.SET_DOT_NEXT_DOT_ID, {
            dotId: prevConnectedDot.id,
            nextDotId: null,
          });
        }
        GlobalStore.commit(Mutations.SET_DOT_NEXT_DOT_ID, {
          dotId: selectedDotIds[0],
          nextDotId: nextSSDot.id,
        });
        GlobalStore.commit(Mutations.CLEAR_SELECTED_DOTS);
        this.openToast("Dots successfully connectted!", 2000);
      }
    } else {
      const selectedDot = BaseTool.findDotAtEvent(event);
      if (selectedDot) {
        GlobalStore.commit(Mutations.ADD_SELECTED_DOTS, [selectedDot.id]);
        this.openToast(
          "Dot selected. Now, select a dot from the next stuntsheet (pink indicates dots that have not been connected yet)."
        );
      }
    }
  }

  private openToast(message: string, duration = 7000) {
    this.toast && this.toast.close();
    this.toast = Toast.open({
      type: "is-info",
      queue: false,
      duration,
      message,
    });
  }
};

export default ToolConnectDots;
