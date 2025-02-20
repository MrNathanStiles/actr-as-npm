import { actr_unpack_bytes } from "./ui-state";

// @ts-ignore
@external("env", "actr_canvas2d_fill_style")
export declare function actr_canvas2d_fill_style(red: i32, green: i32, blue: i32, alpha: i32): void;

// @ts-ignore
@external("env", "actr_canvas2d_stroke_style")
export declare function actr_canvas2d_stroke_style(red: i32, green: i32, blue: i32, alpha: i32): void;

// @ts-ignore
@external("env", "actr_canvas2d_begin_path")
export declare function actr_canvas2d_begin_path(): void;

// @ts-ignore
@external("env", "actr_canvas2d_arc")
export declare function actr_canvas2d_arc(x: f32, y: f32, radius: f32, startAngle: f32, endAngle: f32, counterclockwise: bool): void;

// @ts-ignore
@external("env", "actr_canvas2d_arcTo")
export declare function actr_canvas2d_arcTo(x1: f32, y1: f32, x2: f32, y2: f32, radius: f32): void;

// @ts-ignore
@external("env", "actr_canvas2d_ellipse")
export declare function actr_canvas2d_ellipse(x: f32, y: f32, radiusX: f32, radiusY: f32, rotation: f32, startAngle: f32, endAngle: f32, counterclockwise: bool): void;

// @ts-ignore
@external("env", "actr_canvas2d_fill")
export declare function actr_canvas2d_fill(): void;

// @ts-ignore
@external("env", "actr_canvas2d_fill_rect")
export declare function actr_canvas2d_fill_rect(x: f32, y: f32, w: f32, h: f32): void;

// @ts-ignore
@external("env", "_actr_canvas2d_fill_text_length")
declare function _actr_canvas2d_fill_text_length(x: f32, y: f32, text: string, length: i32): void;

// @ts-ignore
@external("env", "actr_canvas2d_pick")
export declare function actr_canvas2d_pick(x: i32, y: i32): u32;

// @ts-ignore
@external("env", "actr_canvas2d_fill_gradient_all")
export declare function actr_canvas2d_fill_gradient_all(x: i32, y: i32, w: i32, h: i32): void;

// @ts-ignore
@external("env", "actr_canvas2d_fill_gradient_pick")
export declare function actr_canvas2d_fill_gradient_pick(x: i32, y: i32, w: i32, h: i32, r: i32, g: i32, b: i32): void;

// @ts-ignore
@external("env", "_actr_canvas2d_measure_text_length")
declare function _actr_canvas2d_measure_text_length(text: string, length: i32): void;

// @ts-ignore
@external("env", "actr_canvas2d_lineto")
export declare function actr_canvas2d_lineto(x: f32, y: f32): void;

// @ts-ignore
@external("env", "actr_canvas2d_moveto")
export declare function actr_canvas2d_moveto(x: f32, y: f32): void;

// @ts-ignore
@external("env", "actr_canvas2d_close_path")
export declare function actr_canvas2d_close_path(): void;

// @ts-ignore
@external("env", "actr_canvas2d_stroke")
export declare function actr_canvas2d_stroke(): void;

// @ts-ignore
@external("env", "actr_canvas2d_stroke_rect")
export declare function actr_canvas2d_stroke_rect(x: f32, y: f32, w: f32, h: f32): void;

export function actr_canvas2d_measure_text(text: string): void {
    _actr_canvas2d_measure_text_length(text, text.length);
}

export function actr_canvas2d_fill_text(x: f32, y: f32, text: string): void {
    _actr_canvas2d_fill_text_length(x, y, text, text.length);
}

export function actr_canvas2d_fill_style_int(color: u32): void {
    const rgba = actr_unpack_bytes(color);
    actr_canvas2d_fill_style(rgba[0], rgba[1], rgba[2], rgba[3]);
}

export function actr_canvas2d_stroke_style_int(color: u32): void {
    const rgba = actr_unpack_bytes(color);
    actr_canvas2d_stroke_style(rgba[0], rgba[1], rgba[2], rgba[3]);
}
