type SpriteConfig = {
  link:string
  frameRate: number
  frameWidth: number
  frameLengthOverride?: Record<number, number>
  frameWidthOverride?: Record<number, number>
};

export default SpriteConfig;
