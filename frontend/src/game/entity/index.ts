import Box from '../box';
import SpriteAnimation from '../sprites';
import Point from '../types/Point';

class Entity {
  private position?:Point;
  private velocityPerSecond:Point = new Point(0, 0);
  private box?:Box;
  private sprite?:SpriteAnimation;

  constructor(sprite?:SpriteAnimation) {
    if (sprite) this.sprite = sprite;
  }

  public frame(frametime:number) {
    if (!this.position) return;
    this.position.X += frametime * this.velocityPerSecond.X;
    this.position.Y += frametime * this.velocityPerSecond.Y;
  }

  public draw(c:CanvasRenderingContext2D) {
    if (!this.sprite) return;
    c.drawImage(this.sprite.imgSource, 0, 0, 26, 43, 100, 50, 26, 43); // temporal
  }
}

export default Entity;
