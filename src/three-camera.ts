import { Object3D } from "./three-object";

// @ts-ignore
@external("env", "actr_three_camera_perspective")
export declare function actr_three_camera_perspective(fov: f32, nearPLane: f32, farPlane: f32): i32;

export class Camera extends Object3D {

}

export class PerspectiveCamera extends Camera {
    public constructor(
        public readonly fov: f32,
        public readonly nearPlane: f32,
        public readonly farPlane: f32,
    ) { 
        super(actr_three_camera_perspective(fov, nearPlane, farPlane));
    }
}
