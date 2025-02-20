import { actr_canvas2d_begin_path, actr_canvas2d_fill_style_int, actr_canvas2d_fill_text, actr_canvas2d_lineto, actr_canvas2d_moveto, actr_canvas2d_stroke, actr_canvas2d_stroke_style_int } from "./canvas";
import { ActrUIControl, ActrUIType } from "./ui-control";
import { ActrUIKeyCode, ActrUIState } from "./ui-state";

export class ActrUIControlText extends ActrUIControl {
    public value: string = '';
    public cursor: i32 = 0;


    public get label(): string {
        return this._text;
    }

    public set label(value: string) {
        if (this._text !== value) return;
        this.uiState.invalidate();
        this._text = value;
    }
    public constructor(

        uiState: ActrUIState,
        x: i32, y: i32, w: i32, h: i32,
        private _text: string
    ) {
        super(uiState, ActrUIType.Text, x, y, w, h);
    }

    public draw(): void {
        const leaf = this.leaf;
        if (leaf == null) return;
        const size = leaf.bounds.size;
        const position = this.position;

        const focused = this.isFocused;
        const hovered = this.isHovered;

        this.drawBackground(position, focused, hovered);

        const charWidth = 9;
        const padSide = 5;
        const maxChars = ((i32)(size.w) - padSide * 2) / charWidth;
        const halfChars = maxChars / 2;
        const charCount = this.value.length;
        let substart = this.cursor - halfChars;

        if (focused) actr_canvas2d_fill_style_int(this.foregroundColorFocused);
        else if (hovered) actr_canvas2d_fill_style_int(this.foregroundColorHovered);
        else actr_canvas2d_fill_style_int(this.foregroundColor);

        if (charCount > maxChars) {
            if (substart < 0) {
                substart = 0;
            }
            if (substart + maxChars > charCount) {
                substart -= substart + maxChars - charCount;
            }
            const display = this.value.substring(substart, maxChars);
            actr_canvas2d_fill_text((f32)(position.x + padSide), (f32)(position.y + size.h - 5), display);
            
        }
        else {
            substart = 0;
            actr_canvas2d_fill_text((f32)(position.x + padSide), (f32)(position.y + size.h - 5), this.value);
        }

        this.drawBorder(position, focused, hovered);
        if (focused) {
            actr_canvas2d_stroke_style_int(this.borderColorFocused);
            actr_canvas2d_begin_path();

            const cursorStart = position.x + 5;
            actr_canvas2d_moveto((f32)(cursorStart + (this.cursor - substart) * charWidth), (f32)(position.y + size.h - 3));
            actr_canvas2d_lineto((f32)(cursorStart + (this.cursor + 1 - substart) * charWidth), (f32)(position.y + size.h - 3));
            actr_canvas2d_stroke();
        }
    }

    _actr_ui_key_down_text(key: ActrUIKeyCode): void {
        let newLength: i32;
        let newValue: string;
        let currentLength = this.value.length;
        switch (key) {
            case ActrUIKeyCode.ArrowLeft:
                // left arrow
                this.cursor--;
                if (this.cursor < 0) {
                    this.cursor = 0;
                } else {
                    this.uiState.invalidate();
                }
                return;

            case ActrUIKeyCode.ArrowRight:
                this.cursor++;
                if (this.cursor > currentLength) {
                    this.cursor = currentLength;
                } else {
                    this.uiState.invalidate();
                }
                return;

            case ActrUIKeyCode.Backspace:
                if (this.cursor == 0) {
                    return;
                }
                this.uiState.invalidate();
                newLength = currentLength - 1;
                newValue = '';
                for (let i: i32 = 0; i < newLength; i++) {
                    if (i < this.cursor - 1) {
                        newValue += this.value.at(i);
                    }
                    else {
                        newValue += this.value.at(i + 1);
                    }
                }
                this.value = newValue;
                this.cursor--;
                return;

            case ActrUIKeyCode.Delete:
                if (this.cursor == currentLength) {
                    return;
                }

                this.uiState.invalidate();
                newLength = currentLength - 1;
                newValue = '';
                for (let i: i32 = 0; i < newLength; i++) {
                    if (i <= this.cursor - 1) {
                        newValue += this.value.at(i);
                    }
                    else {
                        newValue += this.value.at(i + 1);
                    }
                }
                this.value = newValue;
                return;
        }
        if (key >= 32 && key <= 126) {
            newLength = currentLength + 1;
            newValue = '';
            this.uiState.invalidate();
            for (let i: i32 = 0; i < newLength; i++) {

                if (i < this.cursor) {
                    newValue += this.value.at(i);
                }
                else if (i == this.cursor) {
                    newValue += key;
                }
                else {
                    newValue += this.value.at(i - 1);
                }
            }
            this.value = newValue;
            this.cursor++;
        }
    }
}
