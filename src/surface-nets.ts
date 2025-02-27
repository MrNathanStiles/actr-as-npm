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

import { actr_log } from "./log";

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

const cube_edges = new Int32Array(24);
const edge_table = new Int32Array(256);
let tableGenerated = false;

function precomputeEdgeTable(): void {
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

export class SurfaceNetGenerator {

    public constructor() {
        precomputeEdgeTable();
    }

    public makeData(dims: StaticArray<StaticArray<f32>>, f: PointDataGen): SurfaceData {
        //return memoize(function() {
        const res = new StaticArray<i32>(3);
        let i: i32;
        for (i = 0; i < 3; ++i) {
            res[i] = 2 + (i32)(Math.ceil((dims[i][1] - dims[i][0]) / dims[i][2]));
        }
        const volume = new StaticArray<f32>(res[0] * res[1] * res[2])
        let n: i32 = 0;
        let x: f32;
        for (var k = 0, z = dims[2][0] - dims[2][2]; k < res[2]; ++k, z += dims[2][2])
            for (var j = 0, y = dims[1][0] - dims[1][2]; j < res[1]; ++j, y += dims[1][2])
                for (i = 0, x = dims[0][0] - dims[0][2]; i < res[0]; ++i, x += dims[0][2], ++n) {
                    volume[n] = f(x, y, z);
                }
        return new SurfaceData(volume, res);
    }
}



export class SurfaceNet {
    public constructor(
        public vertices: StaticArray<f32>,
        public faces: StaticArray<i32>,
    ) { }
}

export class SurfaceData {
    public constructor(
        public data: StaticArray<f32>,
        public dims: StaticArray<i32>,
    ) { }

    public generateNet(): SurfaceNet {
        const data = this.data;
        const dims = this.dims;
        // var vertices = []
        // let faces = []
        let n = 0
            , x = new StaticArray<i32>(3)
            , R = new StaticArray<i32>(3)
            , grid = new StaticArray<f32>(8)
            , buf_no = 1;
        const vertices: Array<f32> = new Array();
        const faces: Array<i32> = new Array();
        R[0] = 1;
        R[1] = dims[0] + 1;
        R[2] = (dims[0] + 1) * (dims[1] + 1);
        // Resize buffer if necessary 
        const buffer = (R[2] * 2 > 4096)
            ? new StaticArray<i32>(R[2] * 2)
            : new StaticArray<i32>(4096);
        actr_log(`face prediction ${R[2] * 2}`);
        let pushCount: i32 = 0;
        let maxx: f64 = 0;
        let maxy: f64 = 0;
        let maxz: f64 = 0;
        // March over the voxel grid
        for (x[2] = 0; x[2] < dims[2] - 1; ++x[2], n += dims[0], buf_no ^= 1, R[2] = -R[2]) {

            // m is the pointer into the buffer we are going to use.  
            // This is slightly obtuse because javascript does not have good support for packed data structures, so we must use typed arrays :(
            // The contents of the buffer will be the indices of the vertices on the previous x/y slice of the volume
            var m = 1 + (dims[0] + 1) * (1 + buf_no * (dims[1] + 1));
            let i: i32;
            let j: i32;
            for (x[1] = 0; x[1] < dims[1] - 1; ++x[1], ++n, m += 2)
                for (x[0] = 0; x[0] < dims[0] - 1; ++x[0], ++n, ++m) {

                    //Read in 8 field values around this vertex and store them in an array
                    //Also calculate 8-bit mask, like in marching cubes, so we can speed up sign checks later
                    var mask = 0, g = 0, idx = n;
                    for (var k = 0; k < 2; ++k, idx += dims[0] * (dims[1] - 2))
                        for (j = 0; j < 2; ++j, idx += dims[0] - 2)
                            for (i = 0; i < 2; ++i, ++g, ++idx) {
                                var p = data[idx];
                                grid[g] = p;
                                mask |= (p < 0) ? (1 << g) : 0;
                            }

                    //Check for early termination if cell does not intersect boundary
                    if (mask === 0 || mask === 0xff) {
                        continue;
                    }

                    //Sum up edge intersections
                    var edge_mask = edge_table[mask]
                        //, v = [0.0, 0.0, 0.0]
                        , e_count = 0;

                    const v: StaticArray<f32> = StaticArray.fromArray<f32>([0.0, 0.0, 0.0]);


                    //For every edge of the cube...
                    for (i = 0; i < 12; ++i) {

                        //Use edge mask to check if it is crossed
                        if (!(edge_mask & (1 << i))) {
                            continue;
                        }

                        //If it did, increment number of edge crossings
                        ++e_count;

                        //Now find the point of intersection
                        var e0 = cube_edges[i << 1]       //Unpack vertices
                            , e1 = cube_edges[(i << 1) + 1]
                            , g0 = grid[e0]                 //Unpack grid values
                            , g1 = grid[e1]
                            , t = g0 - g1;                 //Compute point of intersection
                        if (Math.abs(t) > 1e-6) {
                            t = g0 / t;
                        } else {
                            continue;
                        }

                        //Interpolate vertices and add up intersections (this can be done without multiplying)
                        for (j = 0, k = 1; j < 3; ++j, k <<= 1) {
                            var a = e0 & k
                                , b = e1 & k;
                            if (a !== b) {
                                v[j] += a ? 1.0 - t : t;
                            } else {
                                v[j] += a ? 1.0 : 0;
                            }
                        }
                    }

                    //Now we just average the edge intersections and add them to coordinate
                    var s: f32 = 1.0 / (f32)(e_count);
                    for (i = 0; i < 3; ++i) {
                        v[i] = (f32)(x[i]) + s * v[i];
                    }

                    //Add vertex to buffer, store pointer to vertex index in buffer
                    buffer[m] = pushCount++;
                    maxx = Math.max(v[0], maxx);
                    maxy = Math.max(v[0], maxy);
                    maxz = Math.max(v[0], maxz);
                    vertices.push(v[0]);
                    vertices.push(v[1]);
                    vertices.push(v[2]);

                    //Now we need to add faces together, to do this we just loop over 3 basis components
                    for (i = 0; i < 3; ++i) {
                        //The first three entries of the edge_mask count the crossings along the edge
                        if (!(edge_mask & (1 << i))) {
                            continue;
                        }

                        // i = axes we are point along.  iu, iv = orthogonal axes
                        var iu = (i + 1) % 3
                            , iv = (i + 2) % 3;

                        //If we are on a boundary, skip it
                        if (x[iu] === 0 || x[iv] === 0) {
                            continue;
                        }

                        //Otherwise, look up adjacent edges in buffer
                        var du = R[iu]
                            , dv = R[iv];

                        //Remember to flip orientation depending on the sign of the corner.
                        if (mask & 1) {
                            // faces.push([buffer[m], buffer[m - du], buffer[m - du - dv], buffer[m - dv]]);
                            faces.push(buffer[m]);
                            faces.push(buffer[m - du]);
                            faces.push(buffer[m - du - dv]);
                            faces.push(buffer[m]);
                            faces.push(buffer[m - du - dv]);
                            faces.push(buffer[m - dv]);
                            /*
                            indices[index    ] = face[0];
                            indices[index + 1] = face[1];
                            indices[index + 2] = face[2];
                            indices[index + 3] = face[0];
                            indices[index + 4] = face[2];
                            indices[index + 5] = face[3];
                            */
                        } else {
                            //faces.push([buffer[m], buffer[m - dv], buffer[m - du - dv], buffer[m - du]]);
                            faces.push(buffer[m]);
                            faces.push(buffer[m - dv]);
                            faces.push(buffer[m - du - dv]);
                            faces.push(buffer[m]);
                            faces.push(buffer[m - du - dv]);
                            faces.push(buffer[m - du]);
                        }
                    }
                }
        }
        let fx: f32 = (f32)(maxx / 2);
        let fy: f32 = (f32)(maxx / 2);
        let fz: f32 = (f32)(maxx / 2);
        for (let i = 0; i < vertices.length; i += 3) {


            vertices[i] -= fx;
            vertices[i + 1] -= fy;
            vertices[i + 2] -= fz;
        }
        // All done!  Return the result
        return new SurfaceNet(StaticArray.fromArray(vertices), StaticArray.fromArray(faces));
    }
}






