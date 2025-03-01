
// @ts-ignore
@external("env", "_actr_three_init")
export declare function _actr_three_init(buffer: StaticArray<f32>, length: i32): void;

// @ts-ignore
@external("env", "actr_three_render")
export declare function actr_three_render(): void;

export const _actr_three_buffer: StaticArray<f32> = new StaticArray<f32>(16);
export function actr_three_init(): void {
    _actr_three_init(_actr_three_buffer, _actr_three_buffer.length);
}

export interface IdentityObject {
    // actr identity
    readonly identity: i32;
}

export class Vector3 {
    public constructor(
        public x: f32,
        public y: f32,
        public z: f32,
    ) { }

    
    public add(vector: Vector3): Vector3 {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z)
    }

    public addIn(vector: Vector3): void {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    public subtract(vector: Vector3): Vector3 {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z)
    }

    public subtractFrom(vector: Vector3): void {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
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




