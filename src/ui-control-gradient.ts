import { actr_canvas2d_fill_gradient_all, actr_canvas2d_fill_gradient_pick } from "./canvas";
import { ActrUIControl, ActrUIType } from "./ui-control";
import { actr_unpack_bytes, ActrUIState } from "./ui-state";

export class ActrUIControlGradient extends ActrUIControl {

    public constructor(
        uiState: ActrUIState,
        x: i32, y: i32, w: i32, h: i32,
        public all: bool,
        public color: u32
    ) {
        super(uiState, ActrUIType.Gradient, x, y, w, h);
    }

    public draw(): void {
        const leaf = this.leaf;
        if (leaf == null) return;
        const size = leaf.bounds.size;
        const position = this.position;
        if (this.all) {
            actr_canvas2d_fill_gradient_all((i32)(position.x), (i32)(position.y), (i32)(size.w), (i32)(size.h));
        }
        else {

            const rgb = actr_unpack_bytes(this.backgroundColor);
            actr_canvas2d_fill_gradient_pick(
                (i32)(position.x), (i32)(position.y), (i32)(size.w), (i32)(size.h),
                rgb[0], rgb[1], rgb[2]);
        }
    }
};