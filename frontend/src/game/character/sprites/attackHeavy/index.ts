import sprite from './index.png';
import { SpriteConfig } from '../../../entity';
import { Point } from '../../../shapes';

const sc:SpriteConfig = {
  link: sprite,
  frameLength: 1 / 15,
  frameSize: 75,
  vertical: true,
  hasReverse: true,
  position: new Point(10, 1),
};

export default sc;
