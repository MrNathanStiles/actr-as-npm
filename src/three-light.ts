import { Object3D } from "./three-object";

// @ts-ignore
@external("env", "actr_three_light_ambient")
export declare function actr_three_light_ambient(color: i32, intensity: f32): i32;

// @ts-ignore
@external("env", "actr_three_light_directional")
export declare function actr_three_light_directional(color: i32, intensity: f32): i32;


export class Light extends Object3D {
    public constructor(
        identity: i32
    ) {
        super(identity);
    }
}

export class DirectionalLight extends Light {
    public constructor(
        public readonly color: i32,
        public readonly intensity: f32,
    ) {
        super(actr_three_light_directional(color, intensity));
    }
}

export class AmbientLight extends Light {

    public constructor(
        public readonly color: i32,
        public readonly intensity: f32,
    ) {
        super(actr_three_light_ambient(color, intensity))
    }
}
