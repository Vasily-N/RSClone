import State from '../entity/state.type';
import walk from '../sprites/character/walk';
import run from '../sprites/character/run';
import idle from '../sprites/character/idle';
import Rectangle from '../types/Rectangle';
import Box from '../box';

enum CharacterStates {
  Idle,
  Walk,
  Run,
  Jump,
  AttackNormal,
  AttackHeavy,
  AttackRange,
}

const normalHurtBox = new Box(new Rectangle(2, 40, 10, 36)); // temporal

const states: Partial<Record<CharacterStates, State>> = {
  [CharacterStates.Idle]: { spite: idle, hurtbox: normalHurtBox },
  [CharacterStates.Walk]: { spite: walk, hurtbox: normalHurtBox },
  [CharacterStates.Run]: { spite: run, hurtbox: normalHurtBox },
};

export default states;
