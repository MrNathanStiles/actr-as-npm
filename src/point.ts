export class ActrPoint2I {
    public constructor(
        public x: i32,
        public y: i32,
    ) {
    }
    
    public toString(): string {
        return `ActrPoint2L:${this.x}.${this.y}`;
    }
}

export class ActrPoint2L {
    public constructor(
        public x: i64,
        public y: i64,
    ) {
    }
    
    public toString(): string {
        return `ActrPoint2L:${this.x}.${this.y}`;
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


export class ActrPoint3L {

    public constructor(
        public x: i64,
        public y: i64,
        public z: i64,
    ) {
    }

    public equals(other: ActrPoint3L): bool {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    public toString(): string {
        return `ActrPoint3L:x:${this.x}:y:${this.y}:z:${this.z}`;
    }
}


export class ActrPoint3I {

    public constructor(
        public x: i32,
        public y: i32,
        public z: i32,
    ) {
    }

    public toString(): string {
        return `ActrPoint3I:${this.x}.${this.y}.${this.z}`;
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

export class ActrPoint3F {

    public constructor(
        public x: f32,
        public y: f32,
        public z: f32,
    ) { }

    public add(vector: ActrPoint3F): ActrPoint3F {
        return new ActrPoint3F(this.x + vector.x, this.y + vector.y, this.z + vector.z)
    }

    public addIn(vector: ActrPoint3F): void {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    public subtract(vector: ActrPoint3F): ActrPoint3F {
        return new ActrPoint3F(this.x - vector.x, this.y - vector.y, this.z - vector.z)
    }

    public subtractFrom(vector: ActrPoint3F): void {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
    }

    public toString(): string {
        return `ActrPoint3F:x:${this.x}:y:${this.y}:z:${this.z}`;
    }
}
