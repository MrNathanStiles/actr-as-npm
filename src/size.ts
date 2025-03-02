export class ActrSize2I {
    public constructor(
        public w: i32,
        public h: i32,
    ) { }
    public toString(): string {
        return `ActrSize2I:${this.w}.${this.h}`;
    }
}
export class ActrSize2L {
    public constructor(
        public w: i64,
        public h: i64,
    ) { }
    public toString(): string {
        return `ActrSize2L:${this.w}.${this.h}`;
    }
}
export class ActrSize3I {
    public constructor(
        public w: i32,
        public h: i32,
        public d: i32,
    ) { }
    public toString(): string {
        return `ActrSize3I:${this.w}.${this.h}.${this.d}`;
    }
}
export class ActrSize3L {
    public constructor(
        public w: i64,
        public h: i64,
        public d: i64,
    ) { }
    public toString(): string {
        return `ActrSize3L:${this.w}.${this.h}.${this.d}`;
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
export class ActrSize3F {
    public constructor(
        public w: f32,
        public h: f32,
        public d: f32,
    ) { }
    public toString(): string {
        return `ActrSize3F:${this.w}.${this.h}.${this.d}`;
    }
}