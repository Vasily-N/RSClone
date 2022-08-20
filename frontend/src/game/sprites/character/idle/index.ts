import sprite from '../walk/index.png';
import SpriteConfig from '../../typeConfig';
import { Point } from '../../../../shapes/';

const sc:SpriteConfig = {
  link: sprite,
  frameLength: 1 / 15,
  frameSize: 43,
  vertical: true,
  hasReverse: true,
  position: new Point(-6, 0),
};

export default sc;
