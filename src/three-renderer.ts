import { IdentityObject } from "./three";

// @ts-ignore
@external("env", "actr_three_webglrenderer")
export declare function actr_three_webglrenderer(): i32;

// @ts-ignore
@external("env", "actr_three_webglrenderer_setsize")
export declare function actr_three_webglrenderer_setsize(width: i32, height: i32): void;

export class WebGLRenderer implements IdentityObject {
    readonly identity: i32;
    public constructor() {
        this.identity = actr_three_webglrenderer();
    }
    public setSize(width: i32, height: i32): void {
        actr_three_webglrenderer_setsize(width, height);
    }
}
