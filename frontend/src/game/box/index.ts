import Point from '../types/Point';
import Rectangle from '../types/Rectangle';

class Box {
  private rect:Rectangle;

  constructor(rectangle:Rectangle) {
    this.rect = new Rectangle(
      rectangle.X - rectangle.Width / 2,
      -rectangle.Y,
      rectangle.Width,
      rectangle.Height,
    );
  }

  public hit(rectangle:Rectangle):boolean {
    throw new Error('Box.hit is not implemented!');
    console.log(rectangle, this.rect);
  }

  public draw(c:CanvasRenderingContext2D, color:string, position:Point) {
    const cLocal = c;
    cLocal.strokeStyle = color;
    c.strokeRect(
      position.X + this.rect.X,
      position.Y + this.rect.Y,
      this.rect.Width,
      this.rect.Height,
    );
  }
}

export default Box;
