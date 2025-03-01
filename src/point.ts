
export class ActrPoint2 {
    public constructor(
        public x: i64,
        public y: i64,
    ) {
    }
    
    public toString(): string {
        return `ActrPoint2:${this.x}.${this.y}`;
    }
}
export class ActrPoint3 {

    public constructor(
        public x: i64,
        public y: i64,
        public z: i64,
    ) {
    }

    public equals(other: ActrPoint3): bool {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    public toString(): string {
        return `ActrPoint3:x:${this.x}:y:${this.y}:z:${this.z}`;
    }
}

export class ActrPoint2D {

    public constructor(
        public x: f64,
        public y: f64,
    ) {
    }

    public toString(): string {
        return `ActrPoint2D:${this.x}.${this.y}`;
    }
}

export class ActrPoint3D {

    public constructor(
        public x: f64,
        public y: f64,
        public z: f64,
    ) {
    }

    public toString(): string {
        return `ActrPoint3D:${this.x}.${this.y}.${this.z}`;
    }
}
