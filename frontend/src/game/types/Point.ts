class Point {
  private x:number;
  public get X() { return this.x; }
  public set X(value:number) { this.x = value; }
  private y:number;
  public get Y() { return this.y; }
  public set Y(value:number) { this.y = value; }

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  public plus(point:Point):Point { // operator overloading for now doesn't exist in js/ts
    return new Point(this.x + point.X, this.y + point.Y);
  }
}

export default Point;
