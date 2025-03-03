import { ActrPoint3 } from "./point";
import { SurfaceNet } from "./surface-net";
import { cube_edges, edge_table } from "./surface-nets";

export class SurfaceNetData {
    public constructor(
        public data: StaticArray<f32>,
        public dims: StaticArray<i32>,
    ) { }

    public generateNet(): SurfaceNet {
        const data = this.data;
        const dims = this.dims;
        let n = 0
            , x = new StaticArray<i32>(3)
            , R = new StaticArray<i32>(3)
            , grid = new StaticArray<f32>(8)
            , buf_no = 1;
        const vertices: Array<f32> = new Array();
        const faces: Array<u32> = new Array();
        R[0] = 1;
        R[1] = dims[0] + 1;
        R[2] = (dims[0] + 1) * (dims[1] + 1);
        // Resize buffer if necessary 
        const buffer = (R[2] * 2 > 4096)
            ? new StaticArray<i32>(R[2] * 2)
            : new StaticArray<i32>(4096);
        
        let pushCount: i32 = 0;
        let minx: f32 = f32.MAX_SAFE_INTEGER;
        let miny: f32 = f32.MAX_SAFE_INTEGER;
        let minz: f32 = f32.MAX_SAFE_INTEGER;
        
        let maxx: f32 = f32.MIN_SAFE_INTEGER;
        let maxy: f32 = f32.MIN_SAFE_INTEGER;
        let maxz: f32 = f32.MIN_SAFE_INTEGER;
        
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

                    minx = Mathf.min(v[0], minx);
                    miny = Mathf.min(v[1], miny);
                    minz = Mathf.min(v[2], minz);
                    
                    maxx = Mathf.max(v[0], maxx);
                    maxy = Mathf.max(v[1], maxy);
                    maxz = Mathf.max(v[2], maxz);
                    
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
                            faces.push(buffer[m]);
                            faces.push(buffer[m - du]);
                            faces.push(buffer[m - du - dv]);
                            faces.push(buffer[m]);
                            faces.push(buffer[m - du - dv]);
                            faces.push(buffer[m - dv]);
                        } else {
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

        const size = new ActrPoint3<f32>(maxx - minx, maxy - miny, maxz - minz);
        const fx: f32 = minx + size.x / 2 as f32;
        const fy: f32 = miny + size.y / 2 as f32;
        const fz: f32 = minz + size.z / 2 as f32;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i] -= fx;
            vertices[i + 1] -= fy;
            vertices[i + 2] -= fz;

            // vertices[i] -= mx;
            // vertices[i + 1] -= my;
            // vertices[i + 2] -= mz;
        }
        // All done!  Return the result
        return new SurfaceNet(StaticArray.fromArray(vertices), StaticArray.fromArray(faces), size.fill());
    }
}
