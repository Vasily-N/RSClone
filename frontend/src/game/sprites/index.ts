import Point from '../helperTypes/point';
import Rectangle from '../helperTypes/rectangle';
import SpriteConfig from './typeConfig';
import SpriteFrame from './typeSpriteFrame';

class SpriteAnimation {
  private readonly imgSource:CanvasImageSource;
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

      ends += frameLength;
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

    if (SpriteAnimation.isBelow0(sprite.frameLength)
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

  private static drawSprite(
    img:CanvasImageSource,
    c:CanvasRenderingContext2D,
    position:Point,
    framePosition:Rectangle,
  ) {
    c.drawImage(
      img,
      framePosition.X,
      framePosition.Y,
      framePosition.Width,
      framePosition.Height,
      Math.round(position.X - framePosition.Width / 2),
      Math.round(position.Y - framePosition.Height),
      framePosition.Width,
      framePosition.Height,
    );
  }

  public drawFrame(c:CanvasRenderingContext2D, position:Point, elapsed:number, reverse?:boolean) {
    const frame = this.getFrame(elapsed);
    if (!frame) return;
    const drawPosition = position.plus(reverse ? this.drawReversePosition : this.drawPosition);
    const framePos = reverse && frame.positionReverse ? frame.positionReverse : frame.position;
    SpriteAnimation.drawSprite(this.imgSource, c, drawPosition, framePos);
  }
}

export default SpriteAnimation;
