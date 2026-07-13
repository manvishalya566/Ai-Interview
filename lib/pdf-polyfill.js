if (typeof globalThis.DOMMatrix === "undefined") {
  class DOMMatrix {
    constructor(transform) {
      this.a = 1; this.b = 0;
      this.c = 0; this.d = 1;
      this.e = 0; this.f = 0;
      if (transform) {
        if (typeof transform === "string") {
          const m = transform.match(/matrix\(([^)]+)\)/);
          if (m) {
            const p = m[1].split(",").map(Number);
            this.a = p[0]; this.b = p[1]; this.c = p[2]; this.d = p[3]; this.e = p[4]; this.f = p[5];
          }
        } else if (transform instanceof DOMMatrix) {
          this.a = transform.a; this.b = transform.b; this.c = transform.c; this.d = transform.d; this.e = transform.e; this.f = transform.f;
        } else if (transform.length >= 6) {
          this.a = transform[0]; this.b = transform[1]; this.c = transform[2]; this.d = transform[3]; this.e = transform[4]; this.f = transform[5];
        }
      }
    }
    get isIdentity() {
      return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.e === 0 && this.f === 0;
    }
    multiplySelf(o) {
      const a = this.a * o.a + this.c * o.b, b = this.b * o.a + this.d * o.b;
      const c = this.a * o.c + this.c * o.d, d = this.b * o.c + this.d * o.d;
      const e = this.a * o.e + this.c * o.f + this.e, f = this.b * o.e + this.d * o.f + this.f;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
    preMultiplySelf(o) {
      const a = o.a * this.a + o.c * this.b, b = o.b * this.a + o.d * this.b;
      const c = o.a * this.c + o.c * this.d, d = o.b * this.c + o.d * this.d;
      const e = o.a * this.e + o.c * this.f + o.e, f = o.b * this.e + o.d * this.f + o.f;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
    translate(x, y) {
      this.e += x * this.a + y * this.c;
      this.f += x * this.b + y * this.d;
      return this;
    }
    scale(x, y) {
      this.a *= x; this.b *= x; this.c *= y; this.d *= y;
      return this;
    }
    invertSelf() {
      const det = this.a * this.d - this.b * this.c;
      if (det === 0) throw new Error("Matrix not invertible");
      const id = 1 / det;
      const a = this.d * id, b = -this.b * id, c = -this.c * id, d = this.a * id;
      const e = (this.c * this.f - this.d * this.e) * id, f = (this.b * this.e - this.a * this.f) * id;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
    toString() {
      return `matrix(${this.a},${this.b},${this.c},${this.d},${this.e},${this.f})`;
    }
  }
  globalThis.DOMMatrix = DOMMatrix;
}

if (typeof globalThis.ImageData === "undefined") {
  globalThis.ImageData = class {
    constructor(w, h) {
      this.width = w;
      this.height = h;
      this.data = new Uint8ClampedArray(w * h * 4);
    }
  };
}

if (typeof globalThis.Path2D === "undefined") {
  globalThis.Path2D = class {
    constructor() { this._paths = []; }
    addPath(path, transform) { this._paths.push({ path, transform }); }
  };
}
