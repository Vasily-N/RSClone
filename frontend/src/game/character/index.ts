import { Controls, ControlsAction as Action } from '../services/controls';
import { Entity, Direction } from '../entity';
import { Point } from '../shapes';
import { CharacterState, states } from './states';
import SurfaceType from '../types';
import sounds from './sounds';
import GameSoundPlay from '../soundPlay'; // todo: get rid of
import { Attack, Flip } from './actionStates';

type ChangeVelX = Partial<{ [t in SurfaceType]: number }> & {
  default: number
  air: number
};

class Character extends Entity {
  private readonly conrols:Controls;
  private static readonly maxVelX = { walk: 100, run: 180 };
  private static readonly changeVelX:ChangeVelX = {
    default: 1500, air: 180, [SurfaceType.Ice]: 100,
  };

  private airJumps = 1;
  private jumpHold = false;
  private static readonly maxAirJumps = 1;
  private static readonly jumpPower = 160; // todo: to character stats

  public get VelocityX() { return this.velocityPerSecond.X; }
  public get VelocityY() { return this.velocityPerSecond.Y; }

  constructor(controls:Controls) {
    super(Point.Zero, states);
    this.conrols = controls;
  }

  private static getMaxVelX(run:boolean):number {
    return run ? Character.maxVelX.run : Character.maxVelX.walk;
  }

  private getXVelChangePerSec() {
    return this.OnSurface
      ? (Character.changeVelX[this.surfaceType as SurfaceType]
        || Character.changeVelX.default)
      : Character.changeVelX.air;
  }

  private processWalk(xVelocityChange:number):void {
    const maxVelX = Math.max(
      Math.abs(this.velocityPerSecond.X),
      Character.getMaxVelX(this.conrols.has(Action.run)),
    );
    this.velocityPerSecond.X = this.direction
      ? Math.max(this.velocityPerSecond.X - xVelocityChange, -maxVelX)
      : Math.min(this.velocityPerSecond.X + xVelocityChange, maxVelX);
  }

  private processSlowDown(xVelocityChange:number):void {
    if (!this.OnSurface) return;

    this.velocityPerSecond.X = this.velocityPerSecond.X < 0
      ? Math.min(this.velocityPerSecond.X + xVelocityChange, 0)
      : Math.max(this.velocityPerSecond.X - xVelocityChange, 0);
  }

  private processJump():boolean {
    if (this.OnSurface) this.airJumps = Character.maxAirJumps;
    if (!this.conrols.has(Action.jump)) {
      this.jumpHold = false;
      return false;
    }
    if (this.jumpHold) return false;
    if (!this.OnSurface) {
      if (!this.airJumps) return false;
      this.airJumps -= 1;
    } else this.surfaceType = null;
    // because surfaces are sticky (to prevent "floating" from stairs)

    const sit = this.stateCurrent === CharacterState.Sit;
    if (sit && !this.platform) return false;
    GameSoundPlay.sound(sounds.jump);
    const ignoreFloorCollision = sit && this.platform;
    if (ignoreFloorCollision) this.Position.Y += 2;
    else this.velocityPerSecond.Y = -Character.jumpPower;

    this.State = CharacterState.Walk;
    this.jumpHold = true;

    return ignoreFloorCollision;
  }

  // todo: move to Entity
  public static readonly StartStateSounds:Partial<Record<CharacterState, string>> = {
    [CharacterState.AttackNormal]: sounds.light,
    [CharacterState.AttackHeavy]: sounds.heavy,
    [CharacterState.AttackRange]: sounds.gun,
    [CharacterState.FlipForward]: sounds.spin,
    [CharacterState.FlipBack]: sounds.spin,
  };

  private processActions(actions:Action[], charStates:CharacterState[]):boolean {
    for (let i = actions.length - 1; i > -1; i -= 1) {
      if (!this.conrols.has(actions[i])) continue;
      const state = charStates[i];
      this.stateElapsedSeconds = 0;
      this.State = state;
      // todo: move to Entity
      const sound = Character.StartStateSounds[state];
      if (sound) GameSoundPlay.sound(sound);
      return true;
    }
    return false;
  }

  private processAttack():boolean {
    return this.processActions(Attack.Keys, Attack.Values);
  }

  private didAFlip = false;
  private processFlip():boolean {
    if (this.OnSurface) {
      this.didAFlip = false;
      return false;
    }
    if (this.didAFlip) return false;
    this.didAFlip = this.processActions(Flip.Keys, Flip.Values);
    if (!this.didAFlip) return false;
    const newX = 60 * (this.stateCurrent === CharacterState.FlipBack ? -1 : 1);
    this.velocityPerSecond.X = newX < 0
      ? Math.min(this.velocityPerSecond.X, newX)
      : Math.max(this.velocityPerSecond.X, newX);
    this.velocityPerSecond.Y = -130;
    if (this.direction) {
      this.State = Flip.Reverse[this.stateCurrent as CharacterState] as CharacterState;
    }
    return true;
  }

  private static longStates:CharacterState[] = [...Attack.Values, ...Flip.Values];

  private longAnimationCheck(elapsedSeconds:number):boolean {
    return (Character.longStates.includes(this.stateCurrent) && !!this.animation
    && !Entity.animationFinished(this.animation, this.stateElapsedSeconds + elapsedSeconds));
  }

  private processControls(elapsedSeconds:number):boolean {
    if (this.OnSurface && Flip.Values.includes(this.stateCurrent)) {
      this.State = CharacterState.Walk;
    }
    const longAnimation = this.longAnimationCheck(elapsedSeconds)
                      || this.processAttack() || this.processFlip();

    const left = this.conrols.has(Action.moveLeft);
    const right = this.conrols.has(Action.moveRight);
    const sit = this.conrols.has(Action.sit);

    const xVelocityChange = elapsedSeconds * this.getXVelChangePerSec();
    if (!longAnimation) {
      if (right) this.direction = Direction.right;
      if (left) this.direction = Direction.left;
    }
    const leftOrRight = left || right;
    if (sit || longAnimation || !leftOrRight) this.processSlowDown(xVelocityChange);
    if (longAnimation) return false;
    if (leftOrRight && !sit) {
      this.processWalk(xVelocityChange);
      this.State = CharacterState.Walk;
    } else
    if (!this.OnSurface) this.State = CharacterState.Walk; // todo: jump
    else this.State = sit ? CharacterState.Sit : CharacterState.Idle;
    return this.processJump();
  }

  public frame(elapsedSeconds:number):boolean {
    const result = this.processControls(elapsedSeconds);
    super.frame(elapsedSeconds);
    return result;
  }

  public levelLoad(position:Point) {
    this.position.X = position.X;
    this.position.Y = position.Y;
  }
}

export default Character;
