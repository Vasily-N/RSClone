import { Rectangle } from '../../shapes';

type SpriteFrame = {
  position:Rectangle;
  positionReverse?:Rectangle;
  ends:number;
};

export default SpriteFrame;
