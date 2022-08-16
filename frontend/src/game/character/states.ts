import State from '../entity/state.type';
import walk from '../sprites/character/walk';
import run from '../sprites/character/run';
import idle from '../sprites/character/idle';
import Rectangle from '../types/Rectangle';

enum CharacterStates {
  Idle,
  Walk,
  Run,
  Jump,
  AttackNormal,
  AttackHeavy,
  AttackRange,
}

const normalHibox = new Rectangle(10, 10, 10, 10);

const states: Partial<Record<CharacterStates, State>> = {
  [CharacterStates.Idle]: { spite: idle, hitbox: normalHibox },
  [CharacterStates.Walk]: { spite: walk, hitbox: normalHibox },
  [CharacterStates.Run]: { spite: run, hitbox: normalHibox },
};

export default states;
