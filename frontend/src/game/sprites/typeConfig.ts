import Point from '../helperTypes/point';

type SpriteConfig = {
  link:string
  frameLength: number
  frameSize: number
  frameLengthOverride?: Record<number, number>
  frameSizeOverride?: Record<number, number>
  vertical?:boolean
  hasReverse?:boolean
  position?:Point
};

export default SpriteConfig;
