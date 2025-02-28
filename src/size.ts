export class ActrSize2 {
    public constructor(
        public w: i64,
        public h: i64,
    ) { }
    public toString(): string {
        return `ActrSize2:${this.w}.${this.h}`;
    }
}
export class ActrSize3 {
    public constructor(
        public w: i64,
        public h: i64,
        public d: i64,
    ) { }
    public toString(): string {
        return `ActrSize3:${this.w}.${this.h}.${this.d}`;
    }
}
export class ActrSize3D {
    public constructor(
        public w: f64,
        public h: f64,
        public d: f64,
    ) { }
    public toString(): string {
        return `ActrSize3D:${this.w}.${this.h}.${this.d}`;
    }
}