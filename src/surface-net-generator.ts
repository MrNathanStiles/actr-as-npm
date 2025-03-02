import { SurfaceNetData } from "./surface-net-data";
import { PointDataGen as SurfaceNetPointgenerator, precomputeEdgeTable } from "./surface-nets";

export class SurfaceNetGenerator {

    public constructor() {
        precomputeEdgeTable();
    }

    public makeData(dims: StaticArray<StaticArray<f32>>, f: SurfaceNetPointgenerator): SurfaceNetData {
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
        return new SurfaceNetData(volume, res);
    }
}