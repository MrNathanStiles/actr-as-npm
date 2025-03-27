import { ActrPoint3 } from "..";
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

    public static makeSimple(position: ActrPoint3<f32>, size: f32, color: i32): Cube {
        return new Cube(position, size, color, color, true, 0.5, false, true);
    }
    
    public constructor(
        position: ActrPoint3<f32>,
        public readonly size: f32,
        
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
        this.mesh.position = position;
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
        const leaf = new ActrOctreeLeaf(
            this.mesh.position.addN(Mathf.ceil(this.size * 0.5)).to<i64>(),
            ActrPoint3.splat((this.size + 1) as i32),
            this.mesh.identity
        );
        tree.insert(leaf);
        
        
    }

}