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

const normalHitbox = new Rectangle(10, 10, 10, 10); // temporal

const states: Partial<Record<CharacterStates, State>> = {
  [CharacterStates.Idle]: { spite: idle, hitbox: normalHitbox },
  [CharacterStates.Walk]: { spite: walk, hitbox: normalHitbox },
  [CharacterStates.Run]: { spite: run, hitbox: normalHitbox },
};

export default states;
