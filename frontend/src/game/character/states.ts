import State from '../entity/typeState';
import walk from '../sprites/character/walk';
import run from '../sprites/character/run';
import idle from '../sprites/character/idle';
import Rectangle from '../helperTypes/rectangle';
import Box from '../box';

enum CharacterState {
  Idle,
  Walk,
  Run,
  Jump,
  AttackNormal,
  AttackHeavy,
  AttackRange,
}

const normalHurtBox = new Box(new Rectangle(2, 40, 10, 36)); // temporal

const states: Partial<Record<CharacterState, State>> = {
  [CharacterState.Idle]: { spite: idle, hurtbox: normalHurtBox },
  [CharacterState.Walk]: { spite: walk, hurtbox: normalHurtBox },
  [CharacterState.Run]: { spite: run, hurtbox: normalHurtBox },
};

export { CharacterState, states };
