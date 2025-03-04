import { Cube } from "./cube";
import { ActrOctreeBounds } from "./octree-bounds";
import { ActrOctreeLeaf } from "./octree-leaf";
import { ActrPoint3 } from "./point";
import { Scene } from "./three-scene";

const LIST_MAX: i32 = 2;

export class ActrOctree {
    private readonly items: ActrOctreeLeaf[] = [];
    private readonly stuck: ActrOctreeLeaf[] = [];

    private readonly branch: StaticArray<ActrOctree | null> = new StaticArray(8);

    private readonly bounds: ActrOctreeBounds;
    private cube: Cube | null = null;
    public constructor(
        private readonly root: bool,
        position: ActrPoint3<i64>,
        size: i64,
        private parent: ActrOctree | null,
        public readonly scene: Scene | null
    ) {
        this.bounds = new ActrOctreeBounds(position, size);
        this.visualize();
    }

    public toString(): string {
        return `ActrOctree:bounds:${this.bounds}`;
    }

    public isEmpty(): bool {
        if (this.stuck.length) return false;
        if (this.items.length) return false;
        for (let i = 0; i < 8; i++) {
            if (this.branch[i] == null) continue;
            if (!this.branch[i]!.isEmpty()) return false;
        }
        return true;
    }

    private visualize(): void {
        if (this.scene == null) return;
        if (this.cube) {
            this.cube!.dispose();
        }
        this.cube = new Cube(
            this.bounds.point.addN(this.bounds.size / 2).to<f32>(),
            (f32)(this.bounds.size),
            0x00ff00,
            0x00ff00,
            true,
            0.1,
            true,
            false
        );
        this.cube!.addToScene(this.scene!);


        for (let i = 0; i < this.stuck.length; i++) {
            this.stuck[i].visualize(this.scene!, true);
        }

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].visualize(this.scene!, false);
        }
    }

    // bottom
    // 0 1
    // 3 2
    // top
    // 4 5
    // 7 6

    private grow(): void {
        let newTree: ActrOctree;
        const size: i64 = this.bounds.size;
        const halfSize: i64 = size / 2;
        // bottom leaves become top leaves in new bottom leaf
        // top leaves become bottom leaves in new top leaf
        let branch = this.branch[0];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 0 becomes 6 in new 0
            newTree = new ActrOctree(false, this.bounds.point.addXYZ(-halfSize, -halfSize, halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[6] = branch;
            this.branch[0] = newTree;
        }
        branch = this.branch[1];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 1 becomes 7 in new 1
            newTree = new ActrOctree(false, this.bounds.point.addXYZ(halfSize, -halfSize, halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[7] = branch;
            this.branch[1] = newTree;
        }
        branch = this.branch[2];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 2 becomes 4 in new 2
            newTree = new ActrOctree(false,
                this.bounds.point.addXYZ(halfSize, -halfSize, - halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[4] = branch;
            this.branch[2] = newTree;
        }
        branch = this.branch[3];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 3 becomes 5 in new 3
            newTree = new ActrOctree(false, this.bounds.point.addXYZ(-halfSize, -halfSize, -halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[5] = branch;
            this.branch[3] = newTree;
        }

        branch = this.branch[4];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 4 becomes 2 in new 4
            newTree = new ActrOctree(false,
                this.bounds.point.addXYZ(-halfSize, halfSize, halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[2] = branch;
            this.branch[4] = newTree;
        }
        branch = this.branch[5];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 5 becomes 3 in new 5
            newTree = new ActrOctree(false,
                this.bounds.point.addXYZ(halfSize, halfSize, halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[3] = branch;
            this.branch[5] = newTree;
        }
        branch = this.branch[6];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 6 becomes 0 in new 6
            newTree = new ActrOctree(false,
                this.bounds.point.addXYZ(halfSize, halfSize, -halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[0] = branch;
            this.branch[6] = newTree;
        }
        branch = this.branch[7];
        if (branch) {
            // 0 1
            // 3 2
            // 4 5
            // 7 6
            // 7 becomes 1 in new 7
            newTree = new ActrOctree(false,
                this.bounds.point.addXYZ(-halfSize, halfSize, -halfSize), size, this, this.scene);
            branch.parent = newTree;
            newTree.branch[1] = branch;
            this.branch[7] = newTree;
        }

        this.bounds.point = this.bounds.point.addN(-halfSize);
        this.bounds.size += size;
        this.visualize();
    }

    private leftHalf(bounds: ActrOctreeLeaf, xmid: i64): bool {
        return bounds.position.x + bounds.size.x <= xmid;
    }
    private rightHalf(bounds: ActrOctreeLeaf, xmid: i64): bool {
        return bounds.position.x >= xmid;
    }
    private frontHalf(bounds: ActrOctreeLeaf, zmid: i64): bool {
        return bounds.position.z >= zmid;
    }
    private backHalf(bounds: ActrOctreeLeaf, zmid: i64): bool {
        return bounds.position.z - bounds.size.y <= zmid;
    }

    private index(bounds: ActrOctreeLeaf): i32 {
        // 0 1
        // 3 2
        // 4 5
        // 7 6
        const xmid: i64 = this.bounds.point.x + (this.bounds.size / 2);
        const ymid: i64 = this.bounds.point.y + (this.bounds.size / 2);
        const zmid: i64 = this.bounds.point.z + (this.bounds.size / 2);

        if (bounds.position.y + bounds.size.y <= ymid) {
            // bottom half
            if (this.leftHalf(bounds, xmid)) {
                if (this.frontHalf(bounds, zmid)) {
                    return 0;
                } else if (this.backHalf(bounds, zmid)) {
                    return 3;
                }
            } else if (this.rightHalf(bounds, xmid)) {
                if (this.frontHalf(bounds, zmid)) {
                    return 1;
                } else if (this.backHalf(bounds, zmid)) {
                    return 2;
                }
            }
        }
        else if (bounds.position.y >= ymid) {
            // top half
            if (this.leftHalf(bounds, xmid)) {
                if (this.frontHalf(bounds, zmid)) {
                    return 4;
                } else if (this.backHalf(bounds, zmid)) {
                    return 7;
                }
            } else if (this.rightHalf(bounds, xmid)) {
                if (this.frontHalf(bounds, zmid)) {
                    return 5;
                } else if (this.backHalf(bounds, zmid)) {
                    return 6;
                }
            }
        }
        return -1;
    }

    private dump(results: ActrOctreeLeaf[]): void {
        const list: ActrOctree[] = [this];
        while (list.length) {
            const tree = list.pop();
            for (let i = 0; i < tree.stuck.length; i++) {
                results.push(tree.stuck[i]);
            }
            for (let i = 0; i < tree.items.length; i++) {
                results.push(tree.items[i]);
            }
            for (let i = 0; i < 8; i++) {
                const branch = tree.branch[i];
                if (branch == null) continue;
                list.push(branch);
            }
        }
    }
    public query(area: ActrOctreeBounds): ActrOctreeLeaf[] {
        const list: ActrOctree[] = [];
        const results: ActrOctreeLeaf[] = [];

        if (area.intersects(this.bounds)) {
            list.push(this);
        }

        while (list.length) {
            const tree: ActrOctree = list.pop();
            for (let i = 0; i < 8; i++) {
                const branch = tree.branch[i];
                if (!branch) continue;
                if (area.contains(branch.bounds)) {
                    branch.dump(results);
                } else {
                    if (area.intersects(branch.bounds)) {
                        list.push(branch);                    
                    }
                }
                
            }

            for (let i = 0; i < tree.items.length; i++) {
                const leaf = tree.items[i];
                if (area.intersectsLeaf(leaf)) {
                    results.push(leaf);
                }
            }

            for (let i = 0; i < tree.stuck.length; i++) {

                const leaf = tree.stuck[i];
                if (area.intersectsLeaf(leaf)) {
                    results.push(leaf);
                }
            }
        }
        return results;
    }

    private removeTree(child: ActrOctree): void {
        const parent = child.parent;
        if (parent == null) {
            return;
        }
        child.parent = null;

        for (let i = 0; i < 8; i++) {
            if (parent.branch[i] === child) {
                parent.branch[i] = null;
                break;
            }
        }

        if (parent.isEmpty()) this.removeTree(parent);
    }

    public removeLeaf(leaf: ActrOctreeLeaf): void {
        const tree = leaf.parent;
        if (!tree) return;
        let index = tree.items.indexOf(leaf);
        if (index >= 0) {
            tree.items.splice(index, 1);
        } else {
            index = tree.stuck.indexOf(leaf);
            if (index >= 0) {
                tree.stuck.splice(index, 1);
            }
        }

        if (tree.isEmpty()) this.removeTree(tree);
    }

    private generateBranch(index: i32): void {
        if (this.branch[index] != null) return;

        const size = this.bounds.size / 2;
        let x = this.bounds.point.x;
        let y = this.bounds.point.y;
        let z = this.bounds.point.z;

        // 0 1
        // 3 2
        // 4 5
        // 7 6

        if (0 == index) {
            z += size;
        } else if (1 == index) {
            x += size;
            z += size;
        } else if (2 == index) {
            x += size;
        } else if (4 == index) {
            y += size;
            z += size;
        } else if (5 == index) {
            x += size;
            y += size;
            z += size;
        } else if (6 == index) {
            x += size;
            y += size;
        } else if (7 == index) {
            y += size;
        }

        this.branch[index] = new ActrOctree(false, new ActrPoint3<i64>(x, y, z), size, this, this.scene);
    }

    public insert(newLeaf: ActrOctreeLeaf): void {
        if (this.root) {
            while (!this.bounds.containsLeaf(newLeaf)) {
                this.grow();
            }
        }
        this.items.push(newLeaf);
        newLeaf.parent = this;


        if (this.items.length < LIST_MAX) {
            this.visualize();
            return;
        }
        while (this.items.length > 0) {
            newLeaf = this.items.pop();
            const index = this.index(newLeaf);
            if (index < 0 || this.bounds.size == 4) {
                this.stuck.push(newLeaf);
                continue;
            }
            this.generateBranch(index);

            const branch: ActrOctree = this.branch[index]!;
            branch.insert(newLeaf);

        }
        this.items.length = 0;
        this.visualize();
    }
}