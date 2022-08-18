import Point from '../types/Point';
import Rectangle from '../types/Rectangle';

class Box {
  private rect:Rectangle;
  private rectReverse:Rectangle;

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

    console.log(this);
  }

  public hit(rectangle:Rectangle):boolean {
    throw new Error('Box.hit is not implemented!');
    console.log(rectangle, this.rect);
  }

  public draw(c:CanvasRenderingContext2D, color:string, position:Point, reverse?:boolean) {
    const cLocal = c;
    cLocal.strokeStyle = color;
    const rect = reverse ? this.rectReverse : this.rect;
    c.strokeRect(position.X + rect.X, position.Y + rect.Y, rect.Width, rect.Height);
  }
}

export default Box;
