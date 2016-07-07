export class Vector2 {
  constructor(public x:number, public y:number) {
  }

  add(that:Vector2) {
    return new Vector2(this.x + that.x, this.y + that.y)
  }

  sub(that:Vector2) {
    return new Vector2(this.x - that.x, this.y - that.y)
  }

  mult(scale:number) {
    return new Vector2(this.x * scale, this.y * scale)
  }

  div(scale:number) {
    return new Vector2(this.x / scale, this.y / scale)
  }

  tang(scale:number) {
    return new Vector2(this.x * scale, this.y * scale)
  }

  neg() {
    return new Vector2(-this.x, -this.y)
  }

  get lengthSquared() {
    return this.x**2 + this.y**2
  }

  get length() {
    return Math.sqrt(this.lengthSquared)
  }

  rotate(angle:Number):any {
    return new Vector2(
        this.x*Math.cos(angle) - this.y*Math.sin(angle),
        this.x*Math.sin(angle) + this.y*Math.cos(angle));
  }
}
