import Entity from '..';
import Point from '../../types/Point';
import { PlaceholderState, states } from './states';

class Placeholder extends Entity {
  constructor(position:Point) {
    super(position, states);
  }
}

export default Placeholder;
