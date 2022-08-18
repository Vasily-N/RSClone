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
}

export default Point;
