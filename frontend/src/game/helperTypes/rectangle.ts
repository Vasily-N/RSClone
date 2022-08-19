import Line from './line';
import Point from './point';

class Rectangle {
  private x:number;
  public get X() { return this.x; }
  public set X(value:number) { this.x = value; }
  private w:number;
  public get Width() { return this.w; }
  public set Width(value:number) { this.w = value; }
  private y:number;
  public get Y() { return this.y; }
  public set Y(value:number) { this.y = value; }
  private h:number;
  public get Height() { return this.h; }
  public set Height(value:number) { this.h = value; }
  public get Diagonal():Line {
    return new Line(new Point(this.x, this.y), new Point(this.x + this.w, this.y + this.h));
  }

  constructor(x:number, y:number, width:number, height:number) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
  }
}

export default Rectangle;
