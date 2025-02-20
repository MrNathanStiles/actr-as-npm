
// @ts-ignore
@external("env", "_actr_fetch_text_length")
declare function _actr_fetch_text_length(url: string, urlLength: i32, mapId: i32, name: string, nameLength: i32): i32;

// @ts-ignore
@external("env", "_actr_fetch_json_length")
declare function _actr_fetch_json_length(url: string, urlLength: i32, jsonId: i32): i32;

// requires 
// fetch the url asynchronously, puts the result into the provided map
// calls actr_async_result with the returned handle and success indicator  
// returns the handle of the asynchronous operation
// returns < 1 on error

export function actr_fetch_text(url: string, mapId: i32, name: string): i32 {
    return _actr_fetch_text_length(url, url.length, mapId, name, name.length);
}

// fetch the url asynchronously, puts the result into the provided json container
// calls actr_async_result with the returned handle and success indicator  
// returns the handle of the asynchronous operation

// @ts-ignore
@external("env", "actr_fetch_json")
export function actr_fetch_json(url: string, jsonId: i32): i32 {
    return _actr_fetch_json_length(url, url.length, jsonId);
}
