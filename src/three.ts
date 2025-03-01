
// @ts-ignore
@external("env", "actr_three_init")
export declare function actr_three_init(fov: f32, near: f32, far: f32): void;

// @ts-ignore
@external("env", "actr_three_render")
export declare function actr_three_render(): void;


export interface IdentityObject {
    // actr identity
    readonly identity: i32;
}

export class Vector3 {
    public constructor(
        public readonly x: f32,
        public readonly y: f32,
        public readonly z: f32,
    ) { }

    public add(x: f32, y: f32, z: f32): Vector3 {
        return new  Vector3(this.x + x, this.y + y, this.z + z)
    }

    public toString(): string {
        return `Vector3:x:${this.x}:y:${this.y}:z:${this.z}`;
    }
}

export class Euler {
    
    public constructor(
        public readonly x: f32,
        public readonly y: f32,
        public readonly z: f32,    
    ) { }

    public add(x: f32, y: f32, z: f32): Euler {
        return new Euler(this.x + x, this.y + y, this.z + z)
    }
}




