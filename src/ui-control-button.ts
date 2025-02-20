import { actr_canvas2d_fill_style_int, actr_canvas2d_fill_text } from "./canvas";
import { ActrUIControl, ActrUIType } from "./ui-control";
import { ActrUIState } from "./ui-state";

export class ActrUIControlButton extends ActrUIControl {

    private _label: string;
    public get label(): string {
        return this._label;
    }

    public set label(value: string) {
        if (this._label == value) return;
        this.uiState.invalidate();
        this._label = value;
    }

    public constructor(
        uiState: ActrUIState,
        x: i32, y: i32, w: i32, h: i32,
        label: string
    ) {
        super(uiState, ActrUIType.Button, x, y, w, h);
        this._label = label;
    }

    public draw(): void {
        const leaf = this.leaf;
        if (leaf == null)return;
        const focused = this.isFocused;
        const hovered = this.isHovered;
        const position = this.position;
        const size = leaf.bounds.size;

        this.drawBackground(position, focused, hovered);

        if (focused) actr_canvas2d_fill_style_int(this.foregroundColorFocused);
        else if (hovered) actr_canvas2d_fill_style_int(this.foregroundColorHovered);
        else actr_canvas2d_fill_style_int(this.foregroundColor);


        const charWidth = 9;
        const padSide = 6;
        const maxChars = ((i32)(size.w) - padSide * 2) / charWidth;
        const charCount = this._label.length;

        const textLift = 8;
        if (charCount > maxChars) {
            const label = this._label.substring(0, maxChars);
            actr_canvas2d_fill_text((f32)(position.x + padSide), (f32)(position.y + size.h - textLift), label);
        }
        else {
            actr_canvas2d_fill_text((f32)(position.x + padSide), (f32)(position.y + size.h - textLift), this.label);
        }

        this.drawBorder(position, focused, hovered);
    }
}
