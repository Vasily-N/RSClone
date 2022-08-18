import Rectangle from '../helperTypes/rectangle';

type SpriteFrame = {
  position:Rectangle;
  positionReverse?:Rectangle;
  ends:number;
};

export default SpriteFrame;
