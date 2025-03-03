import { ActrPoint3, TOF } from "..";
import { Cube } from "./cube";
import { ActrOctree } from "./octree";
import { Scene } from "./three-scene";

export class ActrOctreeLeaf {
    private cube: Cube | null = null
    public parent: ActrOctree | null = null

    public constructor(
        public readonly position: ActrPoint3<i64>,
        public readonly size: ActrPoint3<i32>,
        public readonly item: i32
    ) {
    }
    public center(): ActrPoint3<i64> {
        return new ActrPoint3<i64>(
            this.position.x + this.size.x / 2,
            this.position.y + this.size.y / 2,
            this.position.z + this.size.z / 2
        );
    }
    public visualize(scene: Scene, stuck: bool): void {
        if (this.cube) {
            this.cube!.dispose();
        }
        const size = this.size.getMax();
        this.cube = new Cube(
            this.center().to<f32>(),
            TOF(size),
            stuck ? 0x888888 : 0x00ffff,
            stuck ? 0x888888 : 0x00ffff,
            true,
            0.25,
            false,
            false
        );
        this.cube!.addToScene(scene)

    }
    public toString(): string {
        return `ActrOctreeLeaf:point:${this.position}:size:${this.size}`;
    }
}