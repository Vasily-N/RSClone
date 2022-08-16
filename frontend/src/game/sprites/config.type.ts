type SpriteConfig = {
  link:string
  frameLength: number
  frameWidth: number
  frameLengthOverride?: Record<number, number>
  frameWidthOverride?: Record<number, number>
};

export default SpriteConfig;
