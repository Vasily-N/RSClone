import Rectangle from '../types/Rectangle';

class Box {
  private rect:Rectangle;

  constructor(rectangle:Rectangle) {
    this.rect = rectangle;
  }

  public hit(rectangle:Rectangle):boolean {
    throw new Error('Box.hit is not implemented!');
    console.log(rectangle, this.rect);
  }
}

export default Box;
