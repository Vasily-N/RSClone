import { Line, Point, Rectangle } from '../shapes';

class Box {
  private rect:Rectangle;
  private rectReverse:Rectangle;
  public getRect(reverse?:boolean):Rectangle { return reverse ? this.rectReverse : this.rect; }

  public static initCombined(rect1:Rectangle, rect2:Rectangle):Rectangle {
    const combinedX1 = Math.min(rect1.X, rect2.X);
    const combinedX2 = Math.max(rect1.X + rect1.Width, rect2.X + rect2.Width);
    const combinedY1 = Math.min(rect1.Y, rect2.Y);
    const combinedY2 = Math.max(rect1.Bottom, rect2.Bottom);
    return Rectangle.fromLine(new Line(
      new Point(combinedX1, combinedY1),
      new Point(combinedX2, combinedY2),
    ));
  }

  constructor(rectangle:Rectangle, direct = false) {
    this.rect = new Rectangle(
      direct ? rectangle.X : rectangle.X - rectangle.Width / 2,
      direct ? rectangle.Y : -rectangle.Y,
      rectangle.Width,
      rectangle.Height,
    );
    this.rectReverse = new Rectangle(
      -this.rect.Right,
      this.rect.Top,
      rectangle.Width,
      rectangle.Height,
    );
  }

  public hit(rectangle:Rectangle):boolean {
    throw new Error('Box.hit is not implemented!');
    console.log(rectangle, this.rect);
  }

  public draw(c:CanvasRenderingContext2D, position:Point, zoom:number, reverse?:boolean) {
    const rect = this.getRect(reverse);
    const x = Math.round(position.X + rect.X * zoom);
    const y = Math.round(position.Y + rect.Y * zoom);
    c.strokeRect(x, y, rect.Width * zoom, rect.Height * zoom);
  }
}

export default Box;
