import { ActrOctreeLeaf } from "./octree-leaf";
import { ActrPoint3 } from "./point";

export class ActrOctreeBounds {
    
    public size: i64;

    public constructor(
        public point: ActrPoint3<i64>,
        size: i64
    ) {
        this.size = size;
    }

    public center(): ActrPoint3<i64> {
        return new ActrPoint3<i64>(
            this.point.x + this.size / 2,
            this.point.y + this.size / 2,
            this.point.z + this.size / 2
        );
    }

    public intersectsLeaf(leaf: ActrOctreeLeaf): bool {
        if (this.point.x >= leaf.position.x + leaf.size.x) {
            return false;
        }
        if (leaf.position.x >= this.point.x + this.size) {
            return false;
        }

        if (this.point.y >= leaf.position.y + leaf.size.y) {
            return false;
        }
        if (leaf.position.y >= this.point.y + this.size) {
            return false;
        }

        if (this.point.z >= leaf.position.z + leaf.size.z) {
            return false;
        }
        if (leaf.position.z >= this.point.z + this.size) {
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

        if (this.point.z >= other.point.z + other.size) {
            return false;
        }
        if (other.point.z >= this.point.z + this.size) {
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
            this.point.z <= other.point.z &&
            this.point.z + this.size >= other.point.z + other.size
        ) {
            result = true;
        }

        return result;
    }
    public containsLeaf(leaf: ActrOctreeLeaf): bool {
        let result: bool = false;

        if (
            this.point.x <= leaf.position.x &&
            this.point.x + this.size >= leaf.position.x + leaf.size.x &&
            this.point.y <= leaf.position.y &&
            this.point.y + this.size >= leaf.position.y + leaf.size.y &&
            this.point.z <= leaf.position.z &&
            this.point.z + this.size >= leaf.position.z + leaf.size.z
        ) {
            result = true;
        }

        return result;
    }
    public toString(): string {
        return `ActrOctreeBounds:point:${this.point.toString()}:size:${this.size.toString()}`
    }
}
