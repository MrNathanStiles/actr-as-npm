import { actr_log } from "./log";

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

export class ActrPoint3<T extends number> {

    public static zero<T extends number>(): ActrPoint3<T> {
        return new ActrPoint3<T>(0 as T, 0 as T, 0 as T);
    }

    public static splat<T extends number>(n: T): ActrPoint3<T> {
        return new ActrPoint3<T>(n, n, n);
    }

    public static make<T extends number, N extends number>(x: N, y: N, z: N): ActrPoint3<T> {
        return new ActrPoint3<T>(x as T, y as T, z as T);
    }

    public constructor(    
        public readonly x: T,
        public readonly y: T,
        public readonly z: T
    ) {
    }

    public equals(other: ActrPoint3<T>): bool {
        return this.x == other.x && this.y == other.y && this.z == other.z;
    }

    public add(point: ActrPoint3<T>): ActrPoint3<T> {
        return new ActrPoint3<T>(this.x + point.x as T, this.y + point.y as T, this.z + point.z as T)
    }

    public addXYZ(x: T, y: T, z: T): ActrPoint3<T> {
        return new ActrPoint3<T>(this.x + x as T, this.y + y as T, this.z + z as T);
    }

    public addN(n: T): ActrPoint3<T> {
        return new ActrPoint3<T>(this.x + n as T, this.y + n as T, this.z + n as T);
    }

    public subtract(point: ActrPoint3<T>): ActrPoint3<T> {
        return new ActrPoint3<T>(this.x - point.x as T, this.y - point.y as T, this.z - point.z as T)
    }

    public multiply(scalar: f64): ActrPoint3<T> {
        return new ActrPoint3<T>(this.x * scalar as T, this.y * scalar as T, this.z * scalar as T);
    }

    public divide(scalar: f64): ActrPoint3<T> {
        return new ActrPoint3<T>(this.x / scalar as T, this.y / scalar as T, this.z / scalar as T);
    }

    public dot(point: ActrPoint3<T>): T {
        return this.x * point.x + this.y * point.y + this.z * point.z as T;
    }

    public lengthSquared(): T {
        return this.dot(this);
    }

    public length(): T {
        return Math.sqrt(this.lengthSquared()) as T;
    }

    public normal(): ActrPoint3<T> {
        const length = this.length();
        return new ActrPoint3<T>(
            this.x / length as T,
            this.y / length as T,
            this.z / length as T
        );
    }

    public fill(): ActrPoint3<T> {
        const result = new ActrPoint3<T>(
            (this.x < 0 ? Math.floor(this.x) : Mathf.ceil(this.x)) as T,
            (this.y < 0 ? Math.floor(this.y) : Mathf.ceil(this.y)) as T,
            (this.z < 0 ? Math.floor(this.z) : Mathf.ceil(this.z)) as T,
        );
        return result;
    }

    public max(x: T, y: T, z: T): ActrPoint3<T> {
        return new ActrPoint3<T>(
            Math.max(this.x, x) as T,
            Math.max(this.y, y) as T,
            Math.max(this.z, z) as T
        );
    }

    public getMax(): T {
        return Math.max(Math.max(this.x, this.y), this.z) as T;
    }

    public to<U extends number>(): ActrPoint3<U> {
        return new ActrPoint3<U>(this.x as U, this.y as U, this.z as U);
    }

    public toString(): string {
        return `ActrPoint3<T>:${this.x}.${this.y}.${this.z}`;
    }
}

