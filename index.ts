import { OBJECT, TOTAL_OVERHEAD } from "rt/common";

const UTF16: i32 = 2;

export * from './src/async';
export * from './src/auth';
export * from './src/canvas';
export * from './src/fetch';
export * from './src/json';
export * from './src/log';
export * from './src/octree';
export * from './src/perlin-noise';
export * from './src/point';
export * from './src/quadtree';
export * from './src/size';
export * from './src/surface-nets';
export * from './src/three';
export * from './src/three-camera';
export * from './src/three-geometry';
export * from './src/three-light';
export * from './src/three-material';
export * from './src/three-mesh';
export * from './src/three-scene';
export * from './src/time';
export * from './src/ui-control-button';
export * from './src/ui-control-container';
export * from './src/ui-control-gradient';
export * from './src/ui-control-text';
export * from './src/ui-control';
export * from './src/ui-state';

export function ftoi(value: f64): i64 {
    if (value < 0) return (i64)(value - 1);
    if (value > 0) return (i64)(value + 1);
    return 0;
}

// @ts-ignore
@external("env", "actr_debugger")
export declare function actr_debugger(value: i32): void;

// @ts-ignore
@external("env", "_actr_sanity")
export declare function _actr_sanity(encoding: i32): void;

export function actr_construct(): void {
    _actr_sanity(UTF16);
}

@global function __finalize(ptr: usize): void {
    const obj = changetype<OBJECT>(ptr - TOTAL_OVERHEAD)
    if (obj.rtId == idof<Object>()) {

    }
}
