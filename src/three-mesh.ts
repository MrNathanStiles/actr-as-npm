import { BufferGeometry } from "./three-geometry";
import { Material } from "./three-material";
import { Object3D } from "./three-object";

// @ts-ignore
@external("env", "actr_three_mesh")
export declare function actr_three_mesh(geometry: i32, material: i32): i32;

export class Mesh extends Object3D {
    public constructor(
        public readonly geometry: BufferGeometry,
        public readonly material: Material,
    ) {
        super(actr_three_mesh(geometry.identity, material.identity));
    }

    
}
