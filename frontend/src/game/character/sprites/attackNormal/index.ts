import sprite from './index.png';
import { SpriteConfig } from '../../../entity';
import { Point } from '../../../shapes';

const sc:SpriteConfig = {
  link: sprite,
  frameLength: 1 / 15,
  frameSize: 42,
  vertical: true,
  hasReverse: true,
  position: new Point(4, 0),
};

export default sc;
