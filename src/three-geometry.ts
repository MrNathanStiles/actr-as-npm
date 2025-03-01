import { IdentityObject } from "./three";

// @ts-ignore
@external("env", "actr_three_geometry_dispose")
export declare function actr_three_geometry_dispose(identity: i32): void;

// @ts-ignore
@external("env", "actr_three_geometry_box")
export declare function actr_three_geometry_box(width: f32, height: f32, depth: f32): i32;

// @ts-ignore
@external("env", "actr_three_geometry_buffer")
export declare function actr_three_geometry_buffer(indexCount: i32, indices: StaticArray<u32>, vertexCount: i32, vertices: StaticArray<f32>): i32;

export class BufferGeometry implements IdentityObject {
    public readonly identity: i32;

    private disposed: bool = false;

    public constructor(
        identity: i32,
        indexCount: i32,
        indices: StaticArray<u32> | null,
        vertexCount: i32,
        vertices: StaticArray<f32> | null,
    ) {
        if (identity) {
            this.identity = identity;
        } else {
            this.identity = actr_three_geometry_buffer(indexCount, indices!, vertexCount, vertices!);
        }
    }

    public dispose(): void {
        if (this.disposed) return;
        actr_three_geometry_dispose(this.identity);
        this.disposed = true;
    }
}

export class BoxGeometry extends BufferGeometry {

    public constructor(
        public readonly width: f32,
        public readonly height: f32,
        public readonly depth: f32,
    ) {
        super(actr_three_geometry_box(width, height, depth), 0, null, 0, null);
    }
}
