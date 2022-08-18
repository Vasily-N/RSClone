import sprite from './index.png';
import SpriteConfig from '../../typeConfig';
import Point from '../../../helperTypes/point';

const sc:SpriteConfig = {
  link: sprite,
  frameLength: 1 / 15,
  frameSize: 43,
  vertical: true,
  hasReverse: true,
  position: new Point(-12, 0),
};

export default sc;
