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

  private diagonal:Line;
  public get Diagonal():Line { return this.diagonal; }
  private leftLine:Line;
  public get LeftLine():Line { return this.leftLine; }
  private rightLine:Line;
  public get RightLine():Line { return this.rightLine; }
  private topLine:Line;
  public get TopLine():Line { return this.topLine; }
  private bottomLine:Line;
  public get BottomLine():Line { return this.bottomLine; }

  public static get Zero():Rectangle { return new Rectangle(0, 0, 0, 0); }

  constructor(x:number, y:number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
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
}

export default Rectangle;
