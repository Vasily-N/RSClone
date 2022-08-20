import Point from './point';

class Line {
  private a:Point;
  public get A():Point { return this.a; }
  private b:Point;
  public get B():Point { return this.b; }
  public static get Zero():Line { return new Line(Point.Zero, Point.Zero); }

  private minX:number;
  public get MinX():number { return this.minX; }
  private maxX:number;
  public get MaxX():number { return this.maxX; }
  private minY:number;
  public get MinY():number { return this.minY; }
  private maxY:number;
  public get MaxY():number { return this.maxY; }
  private difXabs:number;
  public get DifXabs():number { return this.difXabs; }
  private difYabs:number;
  public get DifYabs():number { return this.difYabs; }

  constructor(a:Point, b:Point) {
    this.a = a;
    this.b = b;
    this.minX = Math.min(this.a.X, this.b.X);
    this.maxX = Math.max(this.a.X, this.b.X);
    this.minY = Math.min(this.a.Y, this.b.Y);
    this.maxY = Math.max(this.a.Y, this.b.Y);
    this.difXabs = this.maxX - this.minX;
    this.difYabs = this.maxY - this.minY;
  }
}

export default Line;
