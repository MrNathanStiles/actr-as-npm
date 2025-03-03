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

