type SpriteConfig = {
  link:string
  frameLength: number
  frameSize: number
  frameLengthOverride?: Record<number, number>
  frameSizeOverride?: Record<number, number>
  vertical?:boolean
};

export default SpriteConfig;
