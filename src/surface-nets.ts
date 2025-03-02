// surface-net named files in the project are covered by these notices
// The MIT License (MIT)
//
// Copyright (c) 2012-2013 Mikola Lysenko
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * SurfaceNets in JavaScript ported to Assembly Script
 *
 * Written by Mikola Lysenko (C) 2012
 *
 * Ported by Nathan Stiles
 * 
 * MIT License
 *
 * Based on: S.F. Gibson, "Constrained Elastic Surface Nets". (1998) MERL Tech Report.
 */


export type PointDataGen = (x: f32, y: f32, z: f32) => f32;

export const cube_edges = new Int32Array(24);
export const edge_table = new Int32Array(256);
let tableGenerated = false;

export function precomputeEdgeTable(): void {
    if (tableGenerated) return;
    // Initialize the cube_edges table
    // This is just the vertex number of each cube
    let k: i32 = 0;
    let i: i32;
    let j: i32;
    for (i = 0; i < 8; ++i) {
        for (j = 1; j <= 4; j <<= 1) {
            var p = i ^ j;
            if (i <= p) {
                cube_edges[k++] = i;
                cube_edges[k++] = p;
            }
        }
    }

    // Initialize the intersection table.
    // This is a 2^(cube configuration) ->  2^(edge configuration) map
    // There is one entry for each possible cube configuration, and the output is a 12-bit vector enumerating all edges crossing the 0-level.
    for (i = 0; i < 256; ++i) {
        var em = 0;
        for (j = 0; j < 24; j += 2) {
            var a = !!(i & (1 << cube_edges[j]))
                , b = !!(i & (1 << cube_edges[j + 1]));
            em |= a !== b ? (1 << (j >> 1)) : 0;
        }
        edge_table[i] = em;
    }
    tableGenerated = true;
}



/*
    todo this is scale by distance note that need to be implemented somewhere
    In that case you should be able to just scale it by (1000/distance I want it to look like).
    e.g. if you want it to look like it's 50,000 units away, put it 1000 units away and scale by 1/50.
*/
