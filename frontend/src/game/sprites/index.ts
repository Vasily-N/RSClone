import SpriteConfig from './config.type';
import SpriteFrame from './spriteFrame.type';

class SpriteAnimation {
  private frames:SpriteFrame[] = [];
  private lastFrameEnds = 0;
  private currentFrame = 0;

  public imgSource:CanvasImageSource; // todo: remove placeholder

  constructor(sprite:SpriteConfig) {
    this.imgSource = new Image();
    this.imgSource.src = sprite.link;
  }

  public getFrame(elapsed:number):SpriteFrame | undefined {
    if (!this.frames.length) return undefined;
    while (this.frames[this.currentFrame].ends < (elapsed % this.lastFrameEnds)) {
      this.currentFrame += 1;
    }

    return this.frames[this.currentFrame];
  }
}

export default SpriteAnimation;
