class Point {
  private x:number;
  public get X() { return this.x; }
  public set X(value:number) { this.x = value; }
  private y:number;
  public get Y() { return this.y; }
  public set Y(value:number) { this.y = value; }
  private static readonly zero = new Point(0, 0);
  public static get Zero() { return Point.zero; }

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  // operator overloading for now doesn't exist in js/ts
  public plus(point:Point):Point {
    return new Point(this.x + point.X, this.y + point.Y);
  }

  public minus(point:Point):Point {
    return new Point(this.x - point.X, this.y - point.Y);
  }

  public multiply(n:number):Point {
    return new Point(this.x * n, this.y * n);
  }
}

export default Point;
