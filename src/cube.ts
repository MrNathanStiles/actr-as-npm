import { ActrPoint3F, FTOI, FTOL } from "..";
import { ActrOctree } from "./octree";
import { ActrOctreeLeaf } from "./octree-leaf";
import { actr_three_geometry_dispose, BoxGeometry } from "./three-geometry";
import { actr_three_material_dispose, MeshStandardMaterial } from "./three-material";
import { Mesh } from "./three-mesh";
import { Scene } from "./three-scene";

export class Cube {
    public readonly geo: BoxGeometry;
    public readonly mat: MeshStandardMaterial;
    public readonly mesh!: Mesh;

    private scene: Scene | null = null;
    private disposed: bool = false;

    public static makeSimple(size: f32, x: f32, y: f32, z: f32, color: i32): Cube {
        return new Cube(size, x, y, z, color, color, true, 0.5, false, true);
    }
    
    public constructor(
        public readonly size: f32,
        x: f32,
        y: f32,
        z: f32,
        public readonly color: i32,
        public readonly emissive: i32,
        public readonly transparent: bool,
        public readonly opacity: f32,
        public readonly wireframe: bool,
        public readonly flatShading: bool,
    ) {

        this.geo = new BoxGeometry(size, size, size);
        this.mat = new  MeshStandardMaterial(color, emissive, transparent, opacity, wireframe, flatShading);
        this.mesh = new Mesh(this.geo, this.mat);
        this.mesh.position = new ActrPoint3F(x, y, z);
    }
    public dispose(): void {
        if (this.disposed) return;
        if (this.scene) {
            this.scene!.remove(this.mesh);
        }
        actr_three_geometry_dispose(this.geo.identity);
        actr_three_material_dispose(this.mat.identity);
        this.scene = null;
        this.disposed = true;
    }
    
    public removeFromScene(): void {
        if (this.disposed) return;
        if (!this.scene) return;
        this.scene.remove(this.mesh);
        this.scene = null;
    }
    public addToScene(scene: Scene): void {
        if (this.disposed) return;
        if (this.scene) return;
        scene.add(this.mesh);
        this.scene = scene;
    }

    public addToTree(tree: ActrOctree): void {
        const sizef = Mathf.ceil(this.size);
        const size = FTOI(sizef) + 1;
        const position = this.mesh.position;
        const leaf = new ActrOctreeLeaf(
            FTOL(Mathf.floor(position.x - sizef * 0.5)),
            FTOL(Mathf.floor(position.y - sizef * 0.5)),
            FTOL(Mathf.ceil(position.z + sizef * 0.5)),
            size, size, size,
            this.mesh.identity
        );
        tree.insert(leaf);
        
        
    }
}