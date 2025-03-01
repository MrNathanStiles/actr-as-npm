import { Euler, IdentityObject, Vector3 } from "./three";

// @ts-ignore
@external("env", "actr_three_object_id")
export declare function actr_three_object32_id(identity: i32): i32;

// @ts-ignore
@external("env", "actr_three_object_add")
export declare function actr_three_object_add(containerIdentity: i32, objectIdentity: i32): void;

// @ts-ignore
@external("env", "actr_three_object_lookat")
export declare function actr_three_object_lookat(identity: i32, x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_object_position")
export declare function actr_three_object_position(identity: i32, x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_object_remove")
export declare function actr_three_object_remove(containerIdentity: i32, objectIdentity: i32): void;

// @ts-ignore
@external("env", "actr_three_object_rotation")
export declare function actr_three_object_rotation(identity: i32, x: f32, y: f32, z: f32): void;


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

    private _rotation: Euler = new Euler(0, 0, 0);
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

    public add(object: Object3D): void {
        actr_three_object_add(this.identity, object.identity);
    }

    public lookAt(x: f32, y: f32, z: f32): void {
        actr_three_object_lookat(this.identity, x, y, z);
    }

    public remove(object: Object3D): void {
        actr_three_object_remove(this.identity, object.identity);
    }
}
