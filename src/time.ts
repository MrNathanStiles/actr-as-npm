/// @brief get system time
/// @return allocated string must be freed 

// @ts-ignore
@external("env", "actr_time_string")
export declare function actr_time_string(): string;
// epoch time in seconds


// @ts-ignore
@external("env", "actr_time")
export declare function actr_time(): i64;

// @ts-ignore
@external("env", "actr_performance")
export declare function actr_performance(): f32;