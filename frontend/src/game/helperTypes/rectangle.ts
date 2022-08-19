import Line from './line';
import Point from './point';

class Rectangle {
  private x:number;
  public get X() { return this.x; }
  private w:number;
  public get Width() { return this.w; }
  private y:number;
  public get Y() { return this.y; }
  private h:number;
  public get Height() { return this.h; }

  private diagonal = Line.Zero;
  public get Diagonal():Line { return this.diagonal; }
  private leftLine = Line.Zero;
  public get LeftLine():Line { return this.leftLine; }
  private rightLine = Line.Zero;
  public get RightLine():Line { return this.rightLine; }
  private topLine = Line.Zero;
  public get TopLine():Line { return this.topLine; }
  private bottomLine = Line.Zero;
  public get BottomLine():Line { return this.bottomLine; }

  private initLines() {
    const rightX = this.x + this.w;
    const bottomY = this.y + this.h;

    const topLeft = new Point(this.x, this.y);
    const topRight = new Point(rightX, this.y);
    const bottomLeft = new Point(this.x, bottomY);
    const bottomRight = new Point(rightX, bottomY);
    this.diagonal = new Line(topLeft, bottomRight);
    this.leftLine = new Line(topLeft, bottomLeft);
    this.rightLine = new Line(topRight, bottomRight);
    this.topLine = new Line(topLeft, topRight);
    this.bottomLine = new Line(bottomLeft, bottomRight);
  }

  constructor(x:number, y:number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.initLines();
  }
}

export default Rectangle;
