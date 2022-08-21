import { StateConfig } from '../entity';
import { Rectangle } from '../shapes';
import Box from '../box';

import walk from '../sprites/character/walk';
import run from '../sprites/character/run';
import idle from '../sprites/character/idle';

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

const states: Partial<Record<CharacterState, StateConfig>> = {
  [CharacterState.Idle]: { sprite: idle, hurtbox: normalHurtBox },
  [CharacterState.Walk]: { sprite: walk, hurtbox: normalHurtBox },
  [CharacterState.Run]: { sprite: run, hurtbox: normalHurtBox },
};

export { CharacterState, states };
