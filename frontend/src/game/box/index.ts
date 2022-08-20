import { Point, Rectangle } from '../../shapes';

class Box {
  private rect:Rectangle;
  private rectReverse:Rectangle;
  private rectCombined:Rectangle;
  public get RectCombined():Rectangle { return this.rectCombined; }

  public static initCombined(rect1:Rectangle, rect2:Rectangle):Rectangle {
    const combinedX1 = Math.min(rect1.X, rect2.X);
    const combinedX2 = Math.max(rect1.X + rect1.Width, rect2.X + rect2.Width);
    const combinedY1 = Math.min(rect1.Y, rect2.Y);
    const combinedY2 = Math.min(rect1.Y, rect2.Y);
    return new Rectangle(combinedX1, combinedX2, combinedY1, combinedY2);
  }

  constructor(rectangle:Rectangle) {
    this.rect = new Rectangle(
      rectangle.X - rectangle.Width / 2,
      -rectangle.Y,
      rectangle.Width,
      rectangle.Height,
    );
    this.rectReverse = new Rectangle(
      -rectangle.X - rectangle.Width / 2,
      -rectangle.Y,
      rectangle.Width,
      rectangle.Height,
    );

    this.rectCombined = Box.initCombined(this.rect, this.rectReverse);
  }

  public hit(rectangle:Rectangle):boolean {
    throw new Error('Box.hit is not implemented!');
    console.log(rectangle, this.rect);
  }

  public draw(c:CanvasRenderingContext2D, position:Point, reverse?:boolean) {
    const rect = reverse ? this.rectReverse : this.rect;
    const x = Math.round(position.X + rect.X);
    const y = Math.round(position.Y + rect.Y);
    c.strokeRect(x, y, rect.Width, rect.Height);
  }
}

export default Box;
