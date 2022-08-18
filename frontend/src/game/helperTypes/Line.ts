import Point from './point';

class Line {
  private a:Point;
  public get A():Point { return this.A; }
  public set A(value:Point) { this.A = value; }
  private b:Point;
  public get B():Point { return this.b; }
  public set B(value:Point) { this.b = value; }

  constructor(a:Point, b:Point) {
    this.a = a;
    this.b = b;
  }
}

export default Line;
