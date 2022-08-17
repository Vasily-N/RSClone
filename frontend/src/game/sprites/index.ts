import Point from '../types/Point';
import Rectangle from '../types/Rectangle';
import SpriteConfig from './config.type';
import SpriteFrame from './spriteFrame.type';

class SpriteAnimation {
  private imgSource:CanvasImageSource;
  private frames:SpriteFrame[] = [];
  private lastFrameEnds = 0;
  public get Ends() { return this.lastFrameEnds; }
  private currentFrame = 0;

  public static Empty = {} as SpriteAnimation;

  private static initFrames(img:HTMLImageElement, sprite:SpriteConfig):SpriteFrame[] {
    let i = 0; let x = 0; let e = 0;
    const frames:SpriteFrame[] = [];
    do {
      const w = (sprite.frameWidthOverride && sprite.frameWidthOverride[i]) || sprite.frameWidth;
      const s = (sprite.frameLengthOverride && sprite.frameLengthOverride[i]) || sprite.frameLength;
      e += s * 1000;
      frames.push({ position: new Rectangle(x, 0, w, img.naturalHeight), ends: e });
      i += 1; x += w;
    } while (x < img.naturalWidth);
    return frames;
  }

  private static isBelow0(v:number) {
    return v <= 0;
  }

  private static isAnyBelow0(record:Record<number, number> | undefined) {
    return record && Object.keys(record).find((v) => SpriteAnimation.isBelow0(Number(v)));
  }

  constructor(sprite:SpriteConfig) {
    if (SpriteAnimation.isBelow0(sprite.frameWidth)
    || SpriteAnimation.isAnyBelow0(sprite.frameWidthOverride)) {
      throw new Error(`${sprite.link} - frameWidth can't be below 1`);
    }

    if (SpriteAnimation.isBelow0(sprite.frameLength)
    || SpriteAnimation.isAnyBelow0(sprite.frameLengthOverride)) {
      throw new Error(`${sprite.link} - frameLength can't be below 1`);
    }

    this.imgSource = new Image();
    this.imgSource.src = sprite.link;

    this.frames = SpriteAnimation.initFrames(this.imgSource, sprite);
    const lastFrame = this.frames.at(-1) as SpriteFrame;
    this.lastFrameEnds = lastFrame.ends;
  }

  private getFrame(elapsed:number):SpriteFrame {
    const elapsedF = elapsed % this.lastFrameEnds;
    while (!((elapsedF > (this.currentFrame ? this.frames[this.currentFrame - 1].ends : 0))
        && (elapsedF < this.frames[this.currentFrame].ends))) {
      this.currentFrame += 1;
      if (this.currentFrame === this.frames.length) this.currentFrame = 0;
    }

    return this.frames[this.currentFrame];
  }

  private static drawSprite(
    img:CanvasImageSource,
    c:CanvasRenderingContext2D,
    position:Point,
    frame:SpriteFrame,
  ) {
    c.drawImage(
      img,
      frame.position.X,
      frame.position.Y,
      frame.position.Width,
      frame.position.Height,
      position.X - frame.position.Width / 2,
      position.y - frame.position.Height,
      frame.position.Width,
      frame.position.Height,
    );
  }

  public drawFrame(c:CanvasRenderingContext2D, position:Point, elapsed:number) {
    const spiteFrame = this.getFrame(elapsed);
    SpriteAnimation.drawSprite(this.imgSource, c, position, spiteFrame);
  }
}

export default SpriteAnimation;
