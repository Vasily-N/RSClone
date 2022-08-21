import Line from './line';
import Point from './point';

class Rectangle {
  private x:number;
  public get X() { return this.x; }
  public get Left() { return this.x; }
  private width:number;
  public get Width() { return this.width; }
  private right:number;
  public get Right() { return this.right; }
  private y:number;
  public get Y() { return this.y; }
  public get Top() { return this.y; }
  private height:number;
  public get Height() { return this.height; }
  private bottom:number;
  public get Bottom() { return this.bottom; }

  private diagonalA:Line;
  public get DiagonalA():Line { return this.diagonalA; }
  private diagonalB:Line;
  public get DiagonalB():Line { return this.diagonalB; }
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
    this.width = width;
    this.height = height;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;

    const topLeft = new Point(this.x, this.y);
    const topRight = new Point(this.right, this.y);
    const bottomLeft = new Point(this.x, this.bottom);
    const bottomRight = new Point(this.right, this.bottom);
    this.diagonalA = new Line(topLeft, bottomRight);
    this.diagonalB = new Line(topRight, bottomLeft);
    this.leftLine = new Line(topLeft, bottomLeft);
    this.rightLine = new Line(topRight, bottomRight);
    this.topLine = new Line(topLeft, topRight);
    this.bottomLine = new Line(bottomLeft, bottomRight);
  }
}

export default Rectangle;
