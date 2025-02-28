import { ActrOctree } from "./octree";
import { ActrPoint3 } from "./point";
import { ActrSize3 } from "./size";

export class ActrOctreeLeaf {
    public readonly point: ActrPoint3;
    public readonly size: ActrSize3;

    public parent: ActrOctree | null = null

    public constructor(x: i64, y: i64, z: i64, w: i64, h: i64, d: i64, public item: i32) {
        this.point = new ActrPoint3(x, y, z);
        this.size = new ActrSize3(w, h, d);
    }
    public toString(): string {
        return `ActrOctreeLeaf:point:${this.point}:size:${this.size}`;
    }
}