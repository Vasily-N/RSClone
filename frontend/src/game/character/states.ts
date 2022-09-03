import { StateConfig } from '../entity';
import { Rectangle } from '../shapes';
import Box from '../box';

import walk from './sprites/walk';
import idle from './sprites/idle';
import sit from './sprites/sit';
import normal from './sprites/attackNormal';
import heavy from './sprites/attackHeavy';
import range from './sprites/attackRange';
import flipBack from './sprites/flipBack';
import flipForward from './sprites/flipForward';

enum CharacterState {
  Idle,
  Walk,
  Run,
  Jump,
  Sit,
  AttackNormal,
  AttackHeavy,
  AttackRange,
  FlipBack,
  FlipForward,
}

const hurtboxIdle = new Box(new Rectangle(0, 42, 14, 40));
const hurtboxWalk = new Box(new Rectangle(2, 40, 10, 36));
const hitboxJump = new Box(new Rectangle(2, 6, 14, 6));
const hitboxLightAttack = new Box(new Rectangle(18, 36, 26, 4));
const collisionbox = new Box(new Rectangle(2, 42, 14, 42));
const hurboxSit = new Box(new Rectangle(-4, 22, 18, 22));
const hitboxesHeavy = [
  new Box(new Rectangle(-20, 60, 30, 36)),
  new Box(new Rectangle(5, 76, 60, 40)),
  new Box(new Rectangle(36, 64, 40, 60)),
];
const hitboxRange = new Box(new Rectangle(114, 40, 180, 4));

const states: Partial<Record<CharacterState, StateConfig>> = {
  [CharacterState.Idle]: {
    sprite: idle, collisionbox, hurtbox: hurtboxIdle,
  },
  [CharacterState.Walk]: {
    sprite: walk, collisionbox, hurtbox: hurtboxWalk, hitbox: hitboxJump,
  },
  [CharacterState.Sit]: { sprite: sit, collisionbox, hurtbox: hurboxSit },
  [CharacterState.AttackNormal]: {
    sprite: normal, collisionbox, hurtbox: hurtboxIdle, hitbox: hitboxLightAttack,
  },
  [CharacterState.AttackHeavy]: {
    sprite: heavy, collisionbox, hurtbox: hurtboxIdle, hitboxes: hitboxesHeavy,
  },
  [CharacterState.AttackRange]: {
    sprite: range, collisionbox, hurtbox: hurtboxIdle, hitbox: hitboxRange,
  },
  [CharacterState.FlipBack]: {
    sprite: flipBack, collisionbox, hurtbox: hurtboxIdle,
  },
  [CharacterState.FlipForward]: {
    sprite: flipForward, collisionbox, hurtbox: hurtboxIdle,
  },
};

export { CharacterState, states };
