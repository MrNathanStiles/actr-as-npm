

import { actr_canvas2d_fill_rect, actr_canvas2d_fill_style } from "./canvas";
import { actr_log } from "./log";
import { ActrQuadTree, ActrQuadTreeBounds, ActrQuadTreeLeaf } from "./quadtree";
import { ActrSize2 } from "./size";
import { ActrUIControl, ActrUIType } from "./ui-control";
import { ActrUIControlButton } from "./ui-control-button";
import { ActrUIControlContainer } from "./ui-control-container";
import { ActrUIControlGradient } from "./ui-control-gradient";
import { ActrUIControlText } from "./ui-control-text";

export enum ActrUIKeyCode {
    ArrowLeft = 1,
    ArrowRight = 2,
    Backspace = 3,
    Delete = 4,
    ArrowUp = 5,
    ArrowDown = 6
}

export function actr_pack_bytes(r: i32, g: i32, b: i32, a: i32): i32 {
    return (r << 24) | (g << 16) | (b << 8) | a;
}
export function actr_unpack_bytes(value: i32): i32[] {
    return [
        (value >> 24) & 0xFF,
        (value >> 16) & 0xFF,
        (value >> 8) & 0xFF,
        value & 0xFF
    ];
}

export class ActrUIState {
    private readonly controls: Map<i32, ActrUIControl> = new Map<i32, ActrUIControl>();
    private readonly tree: ActrQuadTree<ActrUIControl>;
    private sequence: i32 = 1;
    private hovered: ActrUIControl | null = null;
    private focused: ActrUIControl | null = null;
    private valid: bool = false;
    public canvasSize: ActrSize2;

    public constructor(w: i32, h: i32) {
        this.tree = new ActrQuadTree(false, 0, 0, 2048, null);
        this.canvasSize = new ActrSize2(w, h);
    }

    public addButton(x: i32, y: i32, w: i32, h: i32, label: string): ActrUIControlButton {
        const button = new ActrUIControlButton(this, x, y, w, h, label);
        const leaf = button.leaf;
        if (leaf != null) {
            this.tree.insert(leaf);
        }
        return button;
    }
    public setFocused(control: ActrUIControl): void {
        if (this.focused === control) return;
        this.focused = control;
        this.invalidate();
    }
    public isHovered(control: ActrUIControl): bool {
        return this.hovered === control;
    }


    public isFocused(control: ActrUIControl): bool {
        return this.focused === control;
    }

    public generateIdentity(): i32 {
        return this.sequence++;
    }
    public invalidate(): void {
        this.valid = false;
    }

    public getControl(identity: i32): ActrUIControl {
        return this.controls.get(identity);
    }

    public removeControl(remove: ActrUIControl): void {
        this.invalidate();
        if (remove.leaf != null) {
            this.tree.removeLeaf(remove.leaf);
        }
        this.controls.delete(remove.identity);
    }

    public actr_ui_key_down(key: ActrUIKeyCode): ActrUIControl | null {

        // key
        // 1 left arrow
        // 2 right arrow
        // 3 backspace
        //  - 31 are available
        // when key >= 32 and key <= 126 normal ascii codes
        const control = this.focused;

        if (!control) {
            return null;
        }

        switch (control.type) {
            case ActrUIType.Button:
                break;
            case ActrUIType.Text:
                (control as ActrUIControlText)._actr_ui_key_down_text(key);
                break;
            case ActrUIType.Container:
                break;
            case ActrUIType.Gradient:
                break;
        }
        return control;
    }

    public _actr_ui_query_sort_comparator(a: ActrUIControl, b: ActrUIControl): bool {
        if (a.zindex == b.zindex) {
            return a.identity < b.identity;
        }

        return a.zindex < b.zindex;
    }

    private query(x: i32, y: i32, w: i32, h: i32): ActrQuadTreeLeaf<ActrUIControl>[] {
        const area = new ActrQuadTreeBounds(x, y, w, h);
        const results = this.tree.query(area)
        // actr_merge_sort_mutate(actr_ui_state->results, 0, actr_ui_state->results->count - 1, _actr_ui_query_sort_comparator, 0);
        return results;
    }
    public actr_ui_resize(w: i32, h: i32): void {
        this.canvasSize.w = w;
        this.canvasSize.h = h;
        this.invalidate();
    }

    public actr_ui_move(x: i32, y: i32): ActrUIControl | null {
        const results = this.query(x, y, 1, 1);
        let hovered: ActrUIControl | null = null;
        for (let i = 0; i < results.length; i++) {
            const leaf = results[i];
            const result = leaf.item as ActrUIControl;
            if (hovered == null || result.zindex > hovered.zindex) {
                hovered = result;
            }
        }
        if (this.hovered == hovered) {
            return this.hovered;
        }
        this.invalidate();
        this.hovered = hovered;
        return this.hovered;
    }

    private _actr_ui_set_focus(control: ActrUIControl | null): void {
        if (this.focused == control) {
            return;
        }
        this.focused = control;

        if (control && control.type === ActrUIType.Text) {
            const text = control as ActrUIControlText;
            text.cursor = text.label.length;
        }
        this.invalidate();
    }

    public actr_ui_tap(x: i32, y: i32): ActrUIControl | null {
        const results = this.query(x, y, 1, 1);

        let target: ActrUIControl | null = null;
        for (let i = 0; i < results.length; i++) {
            const leaf = results[i];
            const result = leaf.item as ActrUIControl;

            if (!target || result.zindex > target.zindex) {
                target = result;
            }
        }
        this._actr_ui_set_focus(target);

        return target;
    }


    public draw(): void {

        if (this.valid) {
            return;
        }

        this.valid = true;
        // clear canvas
        actr_canvas2d_fill_style(0, 0, 0, 100);
        actr_canvas2d_fill_rect(-10, -10, (f32)(this.canvasSize.w + 20), (f32)(this.canvasSize.h + 20));
        // actr_log(`canvas size ${this.canvasSize.w}.${this.canvasSize.h}`);
        const results = this.query(0, 0, this.canvasSize.w, this.canvasSize.h);

        // actr_log(`drawing ${results.length}`);
        for (let i = 0; i < results.length; i++) {
            const leaf = results[i];
            const control = leaf.item as ActrUIControl;

            if (control.hidden) {
                continue;
            }
            let hidden = false;
            let container = control.container;
            while (container) {
                if (container.hidden) {
                    hidden = true;
                    break;
                }
                container = container.container;
            }
            if (hidden) {
                continue;
            }

            switch (control.type) {
                case ActrUIType.Button:
                    const button = control as ActrUIControlButton;
                    button.draw();
                    break;
                case ActrUIType.Text:
                    const text = control as ActrUIControlText;
                    text.draw();
                    break;
                case ActrUIType.Container:
                    const container = control as ActrUIControlContainer;
                    container.draw();
                    break;
                case ActrUIType.Gradient:
                    const gradient: ActrUIControlGradient = control as ActrUIControlGradient;
                    gradient.draw();
                    break;
            }
        }

    }
}

