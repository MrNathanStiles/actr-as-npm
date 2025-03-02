import { ActrOctreeLeaf } from "./octree-leaf";
import { ActrPoint3L } from "./point";

export class ActrOctreeBounds {
    public readonly point: ActrPoint3L;
    public size: i64;

    public constructor(x: i64, y: i64, z: i64, size: i64) {
        this.point = new ActrPoint3L(x, y, z);
        this.size = size;
    }

    public center(): ActrPoint3L {
        return new ActrPoint3L(
            this.point.x + this.size / 2,
            this.point.y + this.size / 2,
            this.point.z - this.size / 2
        );
    }

    public intersectsLeaf(leaf: ActrOctreeLeaf): bool {
        if (this.point.x >= leaf.point.x + leaf.size.w) {
            return false;
        }
        if (leaf.point.x >= this.point.x + this.size) {
            return false;
        }

        if (this.point.y >= leaf.point.y + leaf.size.h) {
            return false;
        }
        if (leaf.point.y >= this.point.y + this.size) {
            return false;
        }

        if (this.point.z <= leaf.point.z - leaf.size.d) {
            return false;
        }
        if (leaf.point.z <= this.point.z - this.size) {
            return false;
        }

        return true;
    }
    public intersects(other: ActrOctreeBounds): bool {
        /*
            RectA.Left < RectB.Right &&
            RectA.Right > RectB.Left &&
            RectA.Top > RectB.Bottom &&
            RectA.Bottom < RectB.Top
        */
        if (this.point.x >= other.point.x + other.size) {
            return false;
        }
        if (other.point.x >= this.point.x + this.size) {
            return false;
        }

        if (this.point.y >= other.point.y + other.size) {
            return false;
        }
        if (other.point.y >= this.point.y + this.size) {
            return false;
        }

        if (this.point.z <= other.point.z - other.size) {
            return false;
        }
        if (other.point.z <= this.point.z - this.size) {
            return false;
        }

        return true;
    }
    public contains(other: ActrOctreeBounds): bool {
        let result: bool = false;
        if (
            this.point.x <= other.point.x &&
            this.point.x + this.size >= other.point.x + other.size &&
            this.point.y <= other.point.y &&
            this.point.y + this.size >= other.point.y + other.size &&
            this.point.z >= other.point.z &&
            this.point.z - this.size <= other.point.z - other.size
        ) {
            result = true;
        }

        return result;
    }
    public containsLeaf(leaf: ActrOctreeLeaf): bool {
        let result: bool = false;

        if (
            this.point.x <= leaf.point.x &&
            this.point.x + this.size >= leaf.point.x + leaf.size.w &&
            this.point.y <= leaf.point.y &&
            this.point.y + this.size >= leaf.point.y + leaf.size.h &&
            this.point.z >= leaf.point.z &&
            this.point.z - this.size <= leaf.point.z - leaf.size.d
        ) {
            result = true;
        }

        return result;
    }
    public toString(): string {
        return `ActrOctreeBounds:point:${this.point.toString()}:size:${this.size.toString()}`
    }
}
