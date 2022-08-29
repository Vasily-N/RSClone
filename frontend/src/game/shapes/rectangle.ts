import Line from './line';
import Point from './point';

class Rectangle {
  private x:number;
  public get X():number { return this.x; }
  public get Left():number { return this.x; }
  private width:number;
  public get Width():number { return this.width; }
  private right:number;
  public get Right():number { return this.right; }
  private y:number;
  public get Y():number { return this.y; }
  public get Top():number { return this.y; }
  private height:number;
  public get Height():number { return this.height; }
  private bottom:number;
  public get Bottom():number { return this.bottom; }

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

  public topLeft:Point;
  public get TopLeft():Point { return this.topLeft; }
  public topRight:Point;
  public get TopRight():Point { return this.topRight; }
  public bottomLeft:Point;
  public get BottomLeft():Point { return this.bottomLeft; }
  public bottomRight:Point;
  public get BottomRight():Point { return this.bottomRight; }

  public get Position():Point { return this.topLeft; }
  private size:Point;
  public get Size():Point { return this.size; }

  public static get Zero():Rectangle { return new Rectangle(0, 0, 0, 0); }

  public static fromLine(line:Line):Rectangle {
    return new Rectangle(line.MinX, line.MinY, line.MaxX - line.MinX, line.MaxY - line.MinY);
  }

  constructor(x:number, y:number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;

    this.size = new Point(width, height);

    this.topLeft = new Point(this.x, this.y);
    this.topRight = new Point(this.right, this.y);
    this.bottomLeft = new Point(this.x, this.bottom);
    this.bottomRight = new Point(this.right, this.bottom);
    this.diagonalA = new Line(this.topLeft, this.bottomRight);
    this.diagonalB = new Line(this.topRight, this.bottomLeft);
    this.leftLine = new Line(this.topLeft, this.bottomLeft);
    this.rightLine = new Line(this.topRight, this.bottomRight);
    this.topLine = new Line(this.topLeft, this.topRight);
    this.bottomLine = new Line(this.bottomLeft, this.bottomRight);
  }

  public multiply(n:number):Rectangle {
    return new Rectangle(this.Left * n, this.Top * n, this.width * n, this.height * n);
  }

  public plusPoint(p:Point):Rectangle {
    return new Rectangle(this.Left + p.X, this.Top + p.Y, this.width, this.height);
  }

  public minusPoint(p:Point):Rectangle {
    return new Rectangle(this.Left - p.X, this.Top - p.Y, this.width, this.height);
  }
}

export default Rectangle;
