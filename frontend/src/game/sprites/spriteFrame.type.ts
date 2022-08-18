import Rectangle from '../types/Rectangle';

type SpriteFrame = {
  position:Rectangle;
  positionReverse?:Rectangle;
  ends:number;
};

export default SpriteFrame;
