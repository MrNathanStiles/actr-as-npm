import { ActrUIControl, ActrUIType } from "./ui-control";
import { ActrUIState } from "./ui-state";

export class ActrUIControlContainer extends ActrUIControl {
    public constructor(
        uiState: ActrUIState,
        x: i32, y: i32, w: i32, h: i32
    ) {
        super(uiState, ActrUIType.Container, x, y, w, h);
    }
}
