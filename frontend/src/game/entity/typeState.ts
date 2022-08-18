import Box from '../box';
import SpriteConfig from '../sprites/typeConfig';

type State = {
  spite?:SpriteConfig;
  hitbox?:Box;
  hitboxes?:Box[];
  hurtbox?:Box;
  hurtboxes?:Box[];
};

export default State;
