import { ActrPoint3F } from "./point";
import { ActrSize3F, ActrSize3I } from "./size";
import { BufferGeometry } from "./three-geometry";
import { MeshStandardMaterial } from "./three-material";
import { Mesh } from "./three-mesh";
import { Scene } from "./three-scene";

export class SurfaceNet {
    private readonly geometry: BufferGeometry;
    private readonly material: MeshStandardMaterial;
    private readonly mesh: Mesh;
    private scene: Scene | null = null;
    private disposed: bool = false;

    public get position(): ActrPoint3F {
        return this.mesh.position;
    }

    public set position(value: ActrPoint3F) {
        this.mesh.position = value;
    }

    public get identity(): i32 {
        return this.mesh.identity;
    }

    public constructor(
        public readonly vertices: StaticArray<f32>,
        public readonly indices: StaticArray<u32>,
        public readonly size: ActrSize3F,
    ) {
        const geometry = new BufferGeometry(0, indices.length, indices, vertices.length, vertices);
        const material = new MeshStandardMaterial(0xffffff, 0x000000, false, 0, false, true);
        this.geometry = geometry;
        this.material = material;
        this.mesh = new Mesh(geometry, material);
    }

    public dispose(): void {
        if (this.disposed) return;
        this.removeFromScene();
        this.geometry.dispose();
        this.material.dispose();
        this.disposed = true;
    }

    public addToScene(scene: Scene): void {
        if (this.disposed) return;
        if (this.scene) return;
        this.scene = scene;
        scene.add(this.mesh);
    }

    public removeFromScene(): void {
        if (this.disposed) return;
        if (this.scene == null) return;
        this.scene.remove(this.mesh);
        this.scene = null;
    }
 }
