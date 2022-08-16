import Entity from '../entity';
import states from './states';

class Character extends Entity {
  constructor() {
    super(states);
  }
}

export default Character;
