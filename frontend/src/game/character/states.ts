import { StateConfig } from '../entity';
import { Rectangle } from '../shapes';
import Box from '../box';

import walk from './sprites/walk';
import run from './sprites/run';
import idle from './sprites/idle';

enum CharacterState {
  Idle,
  Walk,
  Run,
  Jump,
  AttackNormal,
  AttackHeavy,
  AttackRange,
}

const hurtbox = new Box(new Rectangle(2, 40, 10, 36)); // temporal
const hitbox = new Box(new Rectangle(2, 6, 14, 6));
const collisionbox = new Box(new Rectangle(2, 42, 14, 42));

const states: Partial<Record<CharacterState, StateConfig>> = {
  [CharacterState.Idle]: {
    sprite: idle, hurtbox, collisionbox, hitbox,
  },
  [CharacterState.Walk]: { sprite: walk, hurtbox },
  [CharacterState.Run]: { sprite: run, hurtbox },
};

export { CharacterState, states };
