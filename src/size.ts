export class ActrSize32 {
    public constructor(
        public w: i32,
        public h: i32,
    ) {
    }
    public toString(): string {
        return `ActrSize32:${this.w}.${this.h}`;
    }
}
export class ActrSize64 {
    public constructor(
        public w: i64,
        public h: i64,
    ) { }
    public toString(): string {
        return `ActrSize64:${this.w}.${this.h}`;
    }
}