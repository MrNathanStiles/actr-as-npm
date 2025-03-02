import { ActrPoint3F } from "./point";
import { ActrSize3I } from "./size";
import { Mesh } from "./three-mesh";


export class PhysicalObject {

    public position: ActrPoint3F = new ActrPoint3F(0, 0, 0);
    public rotation: ActrPoint3F = new ActrPoint3F(0, 0, 0);
    public velocity: ActrPoint3F = new ActrPoint3F(0, 0, 0);
    public rotationalVelocity: ActrPoint3F = new ActrPoint3F(0, 0, 0);

    
    public constructor(
        public readonly size: ActrSize3I,
        public readonly mesh: Mesh,
    ) {

    }
}