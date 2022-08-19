import Point from './point';

class Line {
  private a:Point;
  public get A():Point { return this.a; }
  public set A(value:Point) { this.A = value; }
  private b:Point;
  public get B():Point { return this.b; }
  public set B(value:Point) { this.b = value; }
  public static get Zero():Line { return new Line(Point.Zero, Point.Zero); }

  constructor(a:Point, b:Point) {
    this.a = a;
    this.b = b;
  }

  public get minX() {
    return Math.min(this.a.X, this.b.X);
  }

  public get maxX() {
    return Math.max(this.a.X, this.b.X);
  }
}

export default Line;
