// @ts-ignore
@external("env", "_actr_json_get_int_length")
export declare function _actr_json_get_int_length(jsonId: i32, path: string, pathLength: i32): i64;

// @ts-ignore
@external("env", "_actr_json_get_float_length")
export declare function _actr_json_get_float_length(jsonId: i32, path: string, pathLength: i32): f64;

// @ts-ignore
@external("env", "_actr_json_get_string_length")
export declare function _actr_json_get_string_length(jsonId: i32, path: string, pathLength: i32): string;

// @ts-ignore
@external("env", "_actr_json_set_int_length")
export declare function _actr_json_set_int_length(jsonId: i32, path: string, pathLength: i32, value: i64): void;

// @ts-ignore
@external("env", "_actr_json_set_float_length")
export declare function _actr_json_set_float_length(jsonId: i32, path: string, pathLength: i32, value: f64): void;

// @ts-ignore
@external("env", "_actr_json_set_string_length")
export declare function _actr_json_set_string_length(jsonId: i32, path: string, pathLength: i32, value: string, valueLength: i32): void;

// @ts-ignore
@external("env", "actr_json_store")
export declare function actr_json_store(jsonId: i32): i32;

// @ts-ignore
@external("env", "actr_json_load")
export declare function actr_json_load(jsonId: i32): i32;

// @ts-ignore
@external("env", "actr_json_delete")
export declare function actr_json_delete(jsonId: i32): i32;

export function actr_json_set_int(jsonId: i32, path: string, value: i64): void {
    _actr_json_set_int_length(jsonId, path, path.length, value);
}

export function actr_json_set_float(jsonId: i32, path: string, value: f64): void {
    _actr_json_set_float_length(jsonId, path, path.length, value);
}
export function actr_json_set_string(jsonId: i32, path: string, value: string): void {
    _actr_json_set_string_length(jsonId, path, path.length, value, value.length);
}

export function actr_json_get_int(jsonId: i32, path: string): i64 {
    return _actr_json_get_int_length(jsonId, path, path.length);
}
export function actr_json_get_float( jsonId: i32,  path: string): f64 {
    return _actr_json_get_float_length(jsonId, path, path.length);
}
export function actr_json_get_string(jsonId: i32, path: string): string {
    return _actr_json_get_string_length(jsonId, path, path.length);
}
