import { ActrOctree } from "./octree";
import { ActrOctreeLeaf } from "./octree-leaf";
import { actr_three_dispose_geometry, actr_three_dispose_material, actr_three_scene_add, actr_three_scene_remove, BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "./three";

export class Cube {
    public readonly geo: BoxGeometry;
    public readonly mat: MeshStandardMaterial;
    public readonly mesh!: Mesh;

    private inScene: bool = false;
    private disposed: bool = false;
    
    public constructor(
        public readonly size: f32,
        public readonly x: f32,
        public readonly y: f32,
        public readonly z: f32,
        public readonly color: i32,
    ) {

        this.geo = new BoxGeometry(size, size, size);
        this.mat = new  MeshStandardMaterial(color, color);
        this.mesh = new Mesh(this.geo, this.mat);
        this.mesh.position = new Vector3(x, y, z);
    }
    public dispose(): void {
        if (this.disposed) return;
        this.removeFromScene();
        actr_three_dispose_geometry(this.geo.identity);
        actr_three_dispose_material(this.mat.identity);
        this.disposed = true;
    }
    
    public removeFromScene(): void {
        if (this.disposed) return;
        if (!this.inScene) return;
        actr_three_scene_remove(this.mesh.identity);
    }
    public addToScene(): void {
        if (this.disposed) return;
        if (this.inScene) return;
        actr_three_scene_add(this.mesh.identity);
        this.inScene = true;
    }

    public addToTree(tree: ActrOctree): void {
        const size = (i64)(Math.round(this.size));
        const leaf = new ActrOctreeLeaf(
            (i64)(Math.round(this.x - this.size / 2)),
            (i64)(Math.round(this.y - this.size / 2)),
            (i64)(Math.round(this.z + this.size / 2)),
            size, size, size,
            this.mesh.identity
        );
        tree.insert(leaf);
        
        
    }
}