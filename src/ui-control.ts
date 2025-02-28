import { actr_canvas2d_fill_rect, actr_canvas2d_fill_style_int, actr_canvas2d_stroke_rect, actr_canvas2d_stroke_style_int } from "./canvas";
import { actr_log } from "./log";
import { ActrPoint2 } from "./point";
import { ActrQuadTreeLeaf } from "./quadtree";
import { ActrUIControlContainer } from "./ui-control-container";
import { actr_pack_bytes, actr_unpack_bytes, ActrUIState } from "./ui-state";

export enum ActrUIType {
    Button,
    Text,
    Container,
    Gradient
}
export class ActrUIControl {
    public readonly identity: i32;
    public leaf: ActrQuadTreeLeaf<ActrUIControl> | null = null;
    public hidden: bool = false;
    public container: ActrUIControlContainer | null = null;
    public foregroundColor: i32;
    public backgroundColor: i32;
    public borderColor: i32;

    public foregroundColorHovered: i32;
    public backgroundColorHovered: i32;
    public borderColorHovered: i32;

    public foregroundColorFocused: i32;
    public backgroundColorFocused: i32;
    public borderColorFocused: i32;

    // public controlState: = null;
    public zindex: i32 = 0;

    public get isHovered(): bool {
        return this.uiState.isHovered(this);
    }

    public get isFocused(): bool {
        return this.uiState.isFocused(this);
    }

    public get position(): ActrPoint2 {
        const result = new ActrPoint2(
            this.leaf!.bounds.point.x,
            this.leaf!.bounds.point.y
        );
        
        let container = this.container;

        while (container) {
            result.x += container.leaf!.bounds.point.x;
            result.y += container.leaf!.bounds.point.y;

            container = container.container;
        }
        return result;
    }

    public constructor(
        protected readonly uiState: ActrUIState,
        public readonly type: ActrUIType,
        x: i32, y: i32, w: i32, h: i32
    ) {
        this.identity = uiState.generateIdentity();
        
        this.leaf = new ActrQuadTreeLeaf(x, y, w, h, this);

        const packed = actr_pack_bytes(128,128, 128, 50);
        const unpcked = actr_unpack_bytes(packed);
        // actr_log(`${unpcked[0]} ${unpcked[1]} ${unpcked[2]} ${unpcked[3]}`);

        const packed2 = actr_pack_bytes(unpcked[0], unpcked[1], unpcked[2], unpcked[3]);
        const unpcked2 = actr_unpack_bytes(packed2);
        // actr_log(`${packed} ${packed2}`);

        this.backgroundColor = actr_pack_bytes(127, 127, 127, 100);
        this.foregroundColor = actr_pack_bytes(0, 0, 0, 100);
        this.borderColor = actr_pack_bytes(255, 255, 255, 100);

        this.backgroundColorHovered = actr_pack_bytes(255, 255, 255, 100);
        this.foregroundColorHovered = actr_pack_bytes(0, 0, 0, 100);
        this.borderColorHovered = actr_pack_bytes(255, 0, 0, 100);

        this.backgroundColorFocused = actr_pack_bytes(0, 0, 0, 100);
        this.foregroundColorFocused = actr_pack_bytes(255, 255, 255, 100);
        this.borderColorFocused = actr_pack_bytes(255, 255, 255, 100);

    }

    public focus(): void {
        this.uiState.setFocused(this);
    }

    public draw(): void {
        const position = this.position;
        const focus = this.isFocused;
        const hovered = this.isHovered;
        this.drawBackground(position, this.isFocused, hovered);
    }
    protected drawBackground(position: ActrPoint2, focused: bool, hovered: bool): void {

        if (focused) actr_canvas2d_fill_style_int(this.backgroundColorFocused);
        else if (hovered) actr_canvas2d_fill_style_int(this.backgroundColorHovered);
        else actr_canvas2d_fill_style_int(this.backgroundColor);

        const leaf = this.leaf
        if (leaf == null) return;
        actr_canvas2d_fill_rect((f32)(position.x), (f32)(position.y), (f32)(leaf.bounds.size.w), (f32)(leaf.bounds.size.h));
    }

    protected drawBorder(position: ActrPoint2, focused: bool, hovered: bool): void {

        if (focused) actr_canvas2d_stroke_style_int(this.borderColorFocused);
        else if (hovered) actr_canvas2d_stroke_style_int(this.borderColorHovered);
        else actr_canvas2d_stroke_style_int(this.borderColor);
        const leaf = this.leaf
        if (leaf == null) return;
        actr_canvas2d_stroke_rect((f32)(position.x), (f32)(position.y), (f32)(leaf.bounds.size.w), (f32)(leaf.bounds.size.h));

    }
}

