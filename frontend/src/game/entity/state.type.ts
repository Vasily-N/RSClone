import Box from '../box';
import SpriteConfig from '../sprites/config.type';

type State = {
  spite?:SpriteConfig;
  hitbox?:Box;
  hitboxes?:Box[];
  hurtbox?:Box;
  hurtboxes?:Box[];
};

export default State;
