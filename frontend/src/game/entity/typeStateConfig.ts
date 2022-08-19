import Box from '../box';
import SpriteConfig from '../sprites/typeConfig';

type StateConfig = {
  spite?:SpriteConfig;
  hitbox?:Box;
  hitboxes?:Box[];
  hurtbox?:Box;
  hurtboxes?:Box[];
  collisionbox?:Box;
  collisionboxes?:Box[];
};

export default StateConfig;
