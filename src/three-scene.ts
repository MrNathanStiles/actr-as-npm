import { Object3D } from "./three-object";

// @ts-ignore
@external("env", "actr_three_scene")
export declare function actr_three_scene(): i32;


export class Scene extends Object3D {
    public constructor() {
        super(actr_three_scene());
    }
    
}