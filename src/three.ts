// @ts-ignore
@external("env", "actr_three_init")
export declare function actr_three_init(fov: f32, near: f32, far: f32): void;

// @ts-ignore
@external("env", "actr_three_box_geometry")
export declare function actr_three_box_geometry(width: f32, height: f32, depth: f32): i32;

// @ts-ignore
@external("env", "actr_three_mesh_standard_material")
export declare function actr_three_mesh_standard_material(color: i32, emissive: i32): i32;

// @ts-ignore
@external("env", "actr_three_mesh")
export declare function actr_three_mesh(geometry: i32, material: i32): i32;

// @ts-ignore
@external("env", "actr_three_camera_position")
export declare function actr_three_camera_position(x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_object_position")
export declare function actr_three_object_position(identity: i32, x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_object_rotation")
export declare function actr_three_object_rotation(identity: i32, x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_render")
export declare function actr_three_render(): void;

// @ts-ignore
@external("env", "actr_three_scene_add")
export declare function actr_three_scene_add(identity: i32): void;

// @ts-ignore
@external("env", "actr_three_perspective_camera")
export declare function actr_three_perspective_camera(fov: f32, aspect: f32, nearPLane: f32, farPlane: f32): i32;

// @ts-ignore
@external("env", "actr_three_scene")
export declare function actr_three_scene(): i32;

// @ts-ignore
@external("env", "actr_three_webglrenderer")
export declare function actr_three_webglrenderer(): i32;

// @ts-ignore
@external("env", "actr_three_webglrenderer_setsize")
export declare function actr_three_webglrenderer_setsize(width: i32, height: i32): void;

// @ts-ignore
@external("env", "actr_three_object32_id")
export declare function actr_three_object32_id(identity: i32): i32;

// @ts-ignore
@external("env", "actr_three_scene_remove")
export declare function actr_three_scene_remove(identity: i32): void;

// @ts-ignore
@external("env", "actr_three_dispose_material")
export declare function actr_three_dispose_material(identity: i32): void;

// @ts-ignore
@external("env", "actr_three_dispose_geometry")
export declare function actr_three_dispose_geometry(identity: i32): void;

// @ts-ignore
@external("env", "actr_three_ambient_light")
export declare function actr_three_ambient_light(color: i32, intensity: f32): i32;

// @ts-ignore
@external("env", "actr_three_directional_light")
export declare function actr_three_directional_light(color: i32, intensity: f32): i32;

// @ts-ignore
@external("env", "actr_three_buffer_geometry")
export declare function actr_three_buffer_geometry(indexCount: i32, indices: StaticArray<u32>, vertexCount: i32, vertices: StaticArray<f32>): i32;

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
}

export class Euler {
    public x: f32 = 0;
    public y: f32 = 0;
    public z: f32 = 0;
}

export class Object3D implements IdentityObject {
    // THREE.js Object3D id
    public get _id(): i32 {
        return actr_three_object32_id(this.identity);
    }
    
    private _position: Vector3 = new Vector3(0, 0, 0);
    public get position(): Vector3 {
        return this._position;
    }
    public set position(value: Vector3) {
        this._position = value;
        actr_three_object_position(this.identity, value.x, value.y, value.z);
        // todo notify
    }

    private _rotation: Euler = new Euler();
    public get rotation(): Euler {
        return this._rotation;
    }
    public set rotation(value: Euler) {
        this._rotation = value;
        actr_three_object_rotation(this.identity, value.x, value.y, value.z);
        // todo notify
    }

    public constructor(
        public readonly identity: i32,
    ) {
        
    }
}

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
        super(actr_three_directional_light(color, intensity));
    }
}

export class AmbientLight extends Light {

    public constructor(
        public readonly color: i32,
        public readonly intensity: f32,
    ) {
        super(actr_three_ambient_light(color, intensity))
    }
}

export class Scene implements IdentityObject {
    readonly identity: i32;
    public constructor() {
        this.identity = actr_three_scene();
    }
}

export class WebGLRenderer implements IdentityObject {
    readonly identity: i32;
    public constructor() {
        this.identity = actr_three_webglrenderer();
    }
    public setSize(width: i32, height: i32): void {
        actr_three_webglrenderer_setsize(width, height);
    }
}

export class Camera extends Object3D {

}

export class PerspectiveCamera extends Camera {
    public constructor(
        public readonly fov: f32,
        public readonly aspect: f32,
        public readonly nearPlane: f32,
        public readonly farPlane: f32,
    ) { 
        super(actr_three_perspective_camera(fov, aspect, nearPlane, farPlane));
    }
}

export class BufferGeometry implements IdentityObject {
    public readonly identity: i32;
    
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
            this.identity = actr_three_buffer_geometry(indexCount, indices!, vertexCount, vertices!);
        }
     }
}

export class BoxGeometry extends BufferGeometry {
    
    public constructor(
        public readonly width: f32, 
        public readonly height: f32, 
        public readonly depth: f32,
    ) {
        super(actr_three_box_geometry(width, height, depth), 0, null, 0, null);
    }
}

export class Material implements IdentityObject {
    public constructor(
        public readonly identity: i32
    ) { }
}

export class MeshStandardMaterial extends Material {
    public constructor(
        public readonly color: i32,
        public readonly emissive: i32,
    ) {
        super(actr_three_mesh_standard_material(color, emissive));
    }
}

export class Mesh extends Object3D {
    public constructor(
        public readonly geometry: BufferGeometry,
        public readonly material: Material,
    ) {
        super(actr_three_mesh(geometry.identity, material.identity));
    }
}

