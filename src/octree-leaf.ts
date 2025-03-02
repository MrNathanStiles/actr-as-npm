import { DTOF, ITOF, LTOF } from "..";
import { Cube } from "./cube";
import { ActrOctree } from "./octree";
import { ActrPoint3L } from "./point";
import { ActrSize3I } from "./size";
import { Scene } from "./three-scene";

export class ActrOctreeLeaf {
    public readonly point: ActrPoint3L;
    public readonly size: ActrSize3I;
    private cube: Cube | null = null
    public parent: ActrOctree | null = null

    public constructor(x: i64, y: i64, z: i64, w: i32, h: i32, d: i32, public item: i32) {
        this.point = new ActrPoint3L(x, y, z);
        this.size = new ActrSize3I(w, h, d);
    }
    public center(): ActrPoint3L {
        return new ActrPoint3L(
            this.point.x + this.size.w / 2,
            this.point.y + this.size.h / 2,
            this.point.z - this.size.d / 2
        );
    }
    public visualize(scene: Scene, stuck: bool): void {
        if (this.cube) {
            this.cube!.dispose();
        }
        const center = this.center();
        const size = Math.max(Math.max(this.size.w, this.size.h), this.size.d);
        this.cube = new Cube(
            DTOF(size),
            LTOF(center.x),
            LTOF(center.y),
            LTOF(center.z),
            stuck ? 0x888888 : 0x00ffff,
            stuck ? 0x888888 : 0x00ffff,
            true,
            0.25,
            true,
            false
        );
        this.cube!.addToScene(scene)

    }
    public toString(): string {
        return `ActrOctreeLeaf:point:${this.point}:size:${this.size}`;
    }
}