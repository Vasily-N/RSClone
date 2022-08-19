import Box from '../box';
import SpriteAnimation from '../sprites';

type State = {
  animation?:SpriteAnimation;
  hitboxes:Box[];
  hurtboxes:Box[];
  collisionboxes:Box[];
};

export default State;
