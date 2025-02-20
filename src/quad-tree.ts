import { actr_log } from "./log";
import { ActrPoint64, ActrPointD } from "./point";
import { ActrSize64 } from "./size";

const LIST_MAX: i32 = 2;

export class ActrQuadTreeBounds {
    public readonly point: ActrPoint64;
    public readonly size: ActrSize64;

    public constructor(x: i64, y: i64, w: i64, h: i64) {
        this.point = new ActrPoint64(x, y);
        this.size = new ActrSize64(w, h);
    }

    public center(): ActrPointD {
        const result = new ActrPointD(0, 0)
        result.x = this.point.x + this.size.w / 2;
        result.y = this.point.y + this.size.h / 2;
        return result;
    }

    public intersects(other: ActrQuadTreeBounds): bool {
        /*
            RectA.Left < RectB.Right &&
            RectA.Right > RectB.Left &&
            RectA.Top > RectB.Bottom &&
            RectA.Bottom < RectB.Top
        */
       actr_log(`${this.toString()} intersects ${other.toString()}`);
        if (this.point.x >= other.point.x + other.size.w) {
            return false;
        }

        if (other.point.x >= this.point.x + this.size.w) {
            return false;
        }
        if (this.point.y >= other.point.y + other.size.h) {
            return false;
        }
        if (other.point.y >= this.point.y + this.size.h) {
            return false;
        }
        return true;
    }
    public contains(other: ActrQuadTreeBounds): bool {
        if (this.point.x <= other.point.x &&
            this.point.x + this.size.w >= other.point.x + other.size.w &&
            this.point.y <= other.point.y &&
            this.point.y + this.size.h >= other.point.y + other.size.h) {
            return true;
        }
        return false;
    }
    public toString(): string {
        return `ActrQuadTreeBounds:point:${this.point.toString()}:size:${this.size.toString()}`
    }
}

export class ActrQuadTreeLeaf<T> {
    public bounds: ActrQuadTreeBounds;
    public parent: ActrQuadTree<T> | null = null

    public constructor(x: i64, y: i64, w: i32, h: i32, public item: Object) {
        this.bounds = new ActrQuadTreeBounds(x, y, w, h);
    }

}


export class ActrQuadTree<T> {
    private readonly items: ActrQuadTreeLeaf<T>[] = [];
    private readonly stuck: ActrQuadTreeLeaf<T>[] = [];

    private readonly branch: StaticArray<ActrQuadTree<T> | null> = new StaticArray(4);

    private readonly bounds: ActrQuadTreeBounds;

    public constructor(
        private readonly root: bool,
        x: i64,
        y: i64,
        size: i64,
        private parent?: ActrQuadTree<T> | null
    ) {
        this.bounds = new ActrQuadTreeBounds(x,y,size,size);
    }

    private grow(): void {
        let newTree: ActrQuadTree<T>;
        const size: i32 = (i32)(this.bounds.size.w);
        const halfSize: i32 = size / 2;
        let branch = this.branch[0];
        if (branch) {
            // 0 1
            // 3 2
            // 0 becomes 2 in new 0
            newTree = new ActrQuadTree(false, this.bounds.point.x - halfSize, this.bounds.point.y - halfSize, size, this);
            branch.parent = newTree;
            newTree.branch[2] = branch;
            this.branch[0] = newTree;
        }
        branch = this.branch[1];
        if (branch) {
            // 0 1
            // 3 2
            // 1 becomes 3 in new 1
            newTree = new ActrQuadTree(false, this.bounds.point.x + halfSize, this.bounds.point.y - halfSize, size, this);
            branch.parent = newTree;
            newTree.branch[3] = branch;
            this.branch[1] = newTree;
        }
        branch = this.branch[2];
        if (branch) {
            // 0 1
            // 3 2
            // 2 becomes 0
            newTree = new ActrQuadTree(false, this.bounds.point.x + halfSize, this.bounds.point.y + halfSize, size, this);
            branch.parent = newTree;
            newTree.branch[0] = branch;
            this.branch[2] = newTree;
        }
        branch = this.branch[3];
        if (branch) {
            // 0 1
            // 3 2
            // 3 becomes 1
            newTree = new ActrQuadTree(false, this.bounds.point.x - halfSize, this.bounds.point.y + halfSize, size, this);
            branch.parent = newTree;
            newTree.branch[1] = branch;
            this.branch[3] = newTree;
        }

        this.bounds.point.x -= halfSize;
        this.bounds.point.y -= halfSize;
        this.bounds.size.w += size;
        this.bounds.size.h += size;
    }

    private index(bounds: ActrQuadTreeBounds): i32 {
        // 0 1
        // 3 2
        const ymid: i64 = this.bounds.point.y + (this.bounds.size.h / 2);
        const xmid: i64 = this.bounds.point.x + (this.bounds.size.w / 2);

        if (bounds.point.y + bounds.size.h <= ymid) {
            // top half
            if (bounds.point.x + bounds.size.w <= xmid) {
                // left half
                return 0;
            }
            if (bounds.point.x >= xmid) {
                // right half
                return 1;
            }
        }
        else if (bounds.point.y >= ymid) {
            // bottom half
            if (bounds.point.x + bounds.size.w <= xmid) {
                // left half
                return 3;
            }
            if (bounds.point.x >= xmid) {
                // right half
                return 2;
            }
        }
        return -1;
    }
    public query(area: ActrQuadTreeBounds): ActrQuadTreeLeaf<T>[] {
        const list: ActrQuadTree<T>[] = [];
        const results: ActrQuadTreeLeaf<T>[] = [];

        if (area.intersects(this.bounds)) {
            list.push(this);
        }

        while (list.length) {
            const tree: ActrQuadTree<T> = list.pop();
            for (let i = 0; i < 4; i++) {
                const branch = tree.branch[i];
                if (!branch) continue;
                if (area.intersects(branch.bounds)) {
                    list.push(branch);
                }
            }
            for (let i = 0; i < tree.items.length; i++) {
                const leaf = tree.items[i];
                if (area.intersects(leaf.bounds)) {
                    results.push(leaf);
                }
            }

            for (let i = 0; i < tree.stuck.length; i++) {

                const leaf = tree.stuck[i];
                if (area.intersects(leaf.bounds)) {
                    results.push(leaf);
                }
            }
        }
        return results;
    }

    private removeTree(child: ActrQuadTree<T>): void {
        const parent = child.parent;
        if (parent == null) {
            return;
        }
        child.parent = undefined;

        for (let i = 0; i < 4; i++) {
            if (parent.branch[i] === child) {
                parent.branch[i] = null;
                break;
            }
        }

        if (parent.items.length > 0) {
            return;
        }

        if (parent.stuck.length > 0) {
            return;
        }

        for (let i = 0; i < 4; i++) {
            if (parent.branch[i]) {
                return;
            }
        }
        this.removeTree(parent);
    }

    public removeLeaf(leaf: ActrQuadTreeLeaf<T>): void {
        const tree = leaf.parent;
        if (!tree) return;
        let index = tree.items.indexOf(leaf);
        if (index >= 0) {
            tree.items.splice(index, 1);
        }
        else {
            index = tree.stuck.indexOf(leaf);
            if (index >= 0) {
                tree.stuck.splice(index, 1);
            }
        }

        if (tree.items.length > 0) {
            return;
        }

        if (tree.stuck.length > 0) {
            return;
        }

        for (let i = 0; i < 4; i++) {
            if (tree.branch[i]) {
                return;
            }
        }
        this.removeTree(tree);

    }
    public insert(newLeaf: ActrQuadTreeLeaf<T>): void {
        if (this.root) {
            while (!this.bounds.contains(newLeaf.bounds)) {
                this.grow();
            }
        }
        this.items.push(newLeaf);
        newLeaf.parent = this;
        actr_log('tree insert');
        
        if (this.items.length < LIST_MAX) {
            return;
        }
        while (this.items.length > 0) {
            newLeaf = this.items.pop();

            const index = this.index(newLeaf.bounds);

            if (index < 0) {
                this.stuck.push(newLeaf);
                newLeaf.parent = this;
                continue;
            }

            if (this.branch[index] == null) {
                const size = this.bounds.size.w / 2;
                let x = this.bounds.point.x;
                let y = this.bounds.point.y;

                if (1 == index) {
                    x += size;
                }
                else if (2 == index) {
                    x += size;
                    y += size;
                }
                else if (3 == index) {
                    y += size;
                }

                this.branch[index] = new ActrQuadTree(false, x, y, size, this);
            }
            const branch = this.branch[index];
            if (branch != null) {
            branch.insert(newLeaf);
            }
        }
        this.items.length = 0;
    }
}