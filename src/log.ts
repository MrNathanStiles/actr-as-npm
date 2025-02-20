// @ts-ignore
@external("env", "_actr_log_length")
export declare function _actr_log_length(text: string, length: i32): void;

/// @brief used for debugging, log messages will appear in the browser console
/// @param pointer 
export function actr_log(text: string): void {
    _actr_log_length(text, text.length);
}
