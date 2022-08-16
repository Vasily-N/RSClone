import SpriteConfig from '../sprites/config.type';
import Rectangle from '../types/Rectangle';

type State = {
  spite?:SpriteConfig;
  hitbox?:Rectangle;
  hitboxes?:Rectangle[];
  hurtbox?:Rectangle;
  hurtboxes?:Rectangle[];
};

export default State;
