import { Point, Rectangle } from '../shapes';
import SpriteConfig from './spriteConfig';

type SpriteFrame = {
  position:Rectangle;
  positionReverse?:Rectangle;
  ends:number;
};

type Render = CanvasRenderingContext2D;
type Img = CanvasImageSource;

class SpriteAnimation {
  private readonly imgSource:Img;
  private readonly sprite:SpriteConfig; // used only for lazy img load
  private frames:SpriteFrame[] = []; // not readonly because lazy load
  private readonly drawPosition:Point = new Point(0, 0);
  private readonly drawReversePosition:Point = new Point(0, 0);
  private lastFrameEnds = 0;
  public get Ends() { return this.lastFrameEnds; }
  private currentFrame = 0;

  public static Empty = {} as SpriteAnimation;

  private static initFrames(img:HTMLImageElement, sprite:SpriteConfig):SpriteFrame[] {
    let i = 0; let posInSprite = 0; let ends = 0;
    const frames:SpriteFrame[] = [];
    const endCondition = sprite.vertical ? img.naturalHeight : img.naturalWidth;
    const size = (sprite.vertical ? img.naturalWidth : img.naturalHeight)
                / (sprite.hasReverse ? 2 : 1);
    do {
      const frameSize = (sprite.frameSizeOverride && sprite.frameSizeOverride[i])
                      || sprite.frameSize;
      const frameLength = (sprite.frameLengthOverride && sprite.frameLengthOverride[i])
                      || sprite.frameLength;

      ends += frameLength || 1;
      const position = sprite.vertical
        ? new Rectangle(0, posInSprite, size, frameSize)
        : new Rectangle(posInSprite, 0, frameSize, size);

      const frame:SpriteFrame = { position, ends };

      if (sprite.hasReverse) {
        frame.positionReverse = sprite.vertical
          ? new Rectangle(size, posInSprite, size, frameSize)
          : new Rectangle(posInSprite, size, frameSize, size);
      }

      frames.push(frame);
      i += 1; posInSprite += frameSize;
    } while (posInSprite < endCondition);
    return frames;
  }

  private static isBelow0(v:number) {
    return v <= 0;
  }

  private static isAnyBelow0(record:Record<number, number> | undefined) {
    return record && Object.keys(record).find((v) => SpriteAnimation.isBelow0(Number(v)));
  }

  private static checkConfig(sprite:SpriteConfig) {
    if (SpriteAnimation.isBelow0(sprite.frameSize)
    || SpriteAnimation.isAnyBelow0(sprite.frameSizeOverride)) {
      throw new Error(`${sprite.link} - frameWidth can't be below 1`);
    }

    if (SpriteAnimation.isBelow0(sprite.frameLength || 1)
    || SpriteAnimation.isAnyBelow0(sprite.frameLengthOverride)) {
      throw new Error(`${sprite.link} - frameLength can't be below 1`);
    }
  }

  private imgOnload() {
    this.frames = SpriteAnimation.initFrames(this.imgSource as HTMLImageElement, this.sprite);
    this.lastFrameEnds = (this.frames.at(-1) as SpriteFrame).ends;
  }

  constructor(sprite:SpriteConfig) {
    SpriteAnimation.checkConfig(sprite);
    this.sprite = sprite;
    this.imgSource = new Image();
    this.imgSource.src = sprite.link;
    this.imgSource.addEventListener('load', this.imgOnload.bind(this));

    if (sprite.position) {
      this.drawPosition = sprite.position;
      this.drawReversePosition = new Point(-sprite.position.X, sprite.position.Y);
    }
  }

  private getFrame(elapsed:number):SpriteFrame | undefined {
    if (!this.lastFrameEnds) return undefined;
    const elapsedF = elapsed % this.lastFrameEnds;
    while (!((elapsedF > (this.currentFrame ? this.frames[this.currentFrame - 1].ends : 0))
        && (elapsedF < this.frames[this.currentFrame].ends))) {
      this.currentFrame += 1;
      if (this.currentFrame === this.frames.length) this.currentFrame = 0;
    }

    return this.frames[this.currentFrame];
  }

  private static aligns:{ [align:number]: (pos:Point, frame:Rectangle, zoom:number) => Point } = {
    1: (pos:Point) => pos,
    8: (pos:Point, frame:Rectangle, zoom:number) => new Point(
      Math.round(pos.X - (frame.Width * zoom) / 2),
      Math.round(pos.Y - (frame.Height * zoom)),
    ),
  };

  private static draw(img:Img, c:Render, pos:Point, frame:Rectangle, zoom:number, align = 8):void {
    const position = SpriteAnimation.aligns[align](pos, frame, zoom);
    if (!position) throw new Error('align is not implemented');
    c.drawImage(
      img,
      frame.X,
      frame.Y,
      frame.Width,
      frame.Height,
      position.X,
      position.Y,
      Math.round(frame.Width * zoom),
      Math.round(frame.Height * zoom),
    );
  }

  public drawFrame(c:Render, pos:Point, zoom:number, elapsed:number, reverse = false, align = 8) {
    const frame = this.getFrame(elapsed);
    if (!frame) return;
    const drawPosition = pos
      .plus((reverse ? this.drawReversePosition : this.drawPosition).multiply(zoom));
    const framePos = reverse && frame.positionReverse ? frame.positionReverse : frame.position;
    SpriteAnimation.draw(this.imgSource, c, drawPosition, framePos, zoom, align);
  }
}

export { SpriteAnimation, SpriteConfig };
