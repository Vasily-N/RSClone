import Box from '../../box';
import SpriteConfig from '../../sprites/spriteConfig';

type StateConfig = {
  sprite?:SpriteConfig;
  hitbox?:Box;
  hitboxes?:Box[];
  hurtbox?:Box;
  hurtboxes?:Box[];
  collisionbox?:Box;
  collisionboxes?:Box[];
};

export default StateConfig;
