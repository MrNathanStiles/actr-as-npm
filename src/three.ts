
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




