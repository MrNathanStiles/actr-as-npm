import { IdentityObject } from "./three";

// @ts-ignore
@external("env", "actr_three_material_dispose")
export declare function actr_three_material_dispose(identity: i32): void;

// @ts-ignore
@external("env", "actr_three_material_standard")
export declare function actr_three_material_standard(color: i32, emissive: i32, transparent: bool, opacity: f32, wireframe: bool, flatShading: bool): i32;

export class Material implements IdentityObject {
    private disposed: bool = false;
    
    public constructor(
        public readonly identity: i32
    ) { }
    
    public dispose(): void {
        if (this.disposed) return;
        actr_three_material_dispose(this.identity);
        this.disposed = true;
    }
}

export class MeshStandardMaterial extends Material {
    public constructor(
        public readonly color: i32,
        public readonly emissive: i32,
        public readonly transparent: bool,
        public readonly opacity: f32,
        public readonly wireframe: bool,
        public readonly flatShading: bool,
    ) {
        super(actr_three_material_standard(color, emissive, transparent, opacity, wireframe, flatShading));
    }

}
