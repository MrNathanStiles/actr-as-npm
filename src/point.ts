
export class ActrPoint32 {
    public constructor(
        public x: i32,
        public y: i32,
    ) {
    }
    
    public toString(): string {
        return `ActrPoint32:${this.x}.${this.y}`;
    }
}
export class ActrPoint64 {

    public constructor(
        public x: i64,
        public y: i64,
    ) {
    }

    public toString(): string {
        return `ActrPoint64:${this.x}.${this.y}`;
    }
}

export class ActrPointD {
    public constructor(
        public x: f64,
        public y: f64,
    ) {
    }
}