import { ActrPoint3 } from "./point";
import { _actr_three_buffer, Euler, IdentityObject } from "./three";

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

// @ts-ignore
@external("env", "actr_three_object_rotate")
export declare function actr_three_object_rotate(identity: i32, x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_object_move_local")
export declare function actr_three_object_move_local(identity: i32, x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_object_move_world")
export declare function actr_three_object_move_world(identity: i32, x: f32, y: f32, z: f32): void;

// @ts-ignore
@external("env", "actr_three_object_to_local")
export declare function actr_three_object_to_local(identity: i32, x: f32, y: f32, z: f32): void;


// @ts-ignore
@external("env", "actr_three_object_to_world")
export declare function actr_three_object_to_world(identity: i32, x: f32, y: f32, z: f32): void;



export class Object3D implements IdentityObject {
    // THREE.js Object3D id
    public get _id(): i32 {
        return actr_three_object32_id(this.identity);
    }

    private _position: ActrPoint3<f32> = new ActrPoint3<f32>(0, 0, 0);
    public get position(): ActrPoint3<f32> {
        return this._position;
    }
    public set position(value: ActrPoint3<f32>) {
        this._position = value;
        actr_three_object_position(this.identity, value.x, value.y, -value.z);
        // todo notify
    }

    private _rotation: Euler = new Euler(0, 0, 0);
    public get rotation(): Euler {
        return this._rotation;
    }
    public set rotation(value: Euler) {
        this._rotation = value;
        actr_three_object_rotation(this.identity, value.x, value.y, -value.z);
        // todo notify
    }

    public constructor(public readonly identity: i32) { }

    public add(object: Object3D): void {
        actr_three_object_add(this.identity, object.identity);
    }

    public lookAt(x: f32, y: f32, z: f32): void {
        actr_three_object_lookat(this.identity, x, y, -z);
    }

    public remove(object: Object3D): void {
        actr_three_object_remove(this.identity, object.identity);
    }

    public rotate(x: f32, y: f32, z: f32): void {
        actr_three_object_rotate(this.identity, x, y, -z);
    }

    public moveLocal(x: f32, y: f32, z: f32): void {
        actr_three_object_move_local(this.identity, x, y, -z);
    }

    public moveWorld(vector: ActrPoint3<f32>): void {
        actr_three_object_move_world(this.identity, vector.x, vector.y, -vector.z);
    }

    public toLocal(vector: ActrPoint3<f32>): ActrPoint3<f32> {
        actr_three_object_to_local(this.identity, vector.x, vector.y, -vector.z);
        return new ActrPoint3<f32>(_actr_three_buffer[0], _actr_three_buffer[1], -_actr_three_buffer[2]);
    }

    public toWorld(vector: ActrPoint3<f32>): ActrPoint3<f32> {
        actr_three_object_to_world(this.identity, vector.x, vector.y, -vector.z);
        return new ActrPoint3<f32>(_actr_three_buffer[0], _actr_three_buffer[1], -_actr_three_buffer[2]);
    }
}
