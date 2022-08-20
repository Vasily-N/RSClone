import { Controls, ControlsAction as Action } from '../services/controls';
import { Entity, Direction } from '../entity';
import { Point } from '../../shapes';
import { CharacterState, states } from './states';
import { SurfaceType } from '../levels/types';

type CntrlChangeXVel = { [t in SurfaceType]: number } & {
  default: number
  air: number
};

class Character extends Entity {
  private readonly conrols:Controls;
  private static readonly cntrlMaxXVel:Record<number, number> = { [+false]: 100, [+true]: 180 };
  private static readonly cntrlChangeXVel:Partial<CntrlChangeXVel> = {
    default: 1500, air: 700, [SurfaceType.Ice]: 400,
  };

  private airJumps = 1;
  private jumpHold = false;
  private static readonly jumpPower = 110; // todo: to character stats

  constructor(controls:Controls) {
    super(Point.Zero, states);
    this.conrols = controls;
  }

  private processWalk(run:boolean, left:boolean, right:boolean, xVelocityChange:number):void {
    const maxXvel = this.OnSurface
      ? Character.cntrlMaxXVel[+run]
      : Math.max(Math.abs(this.velocityPerSecond.X), Character.cntrlMaxXVel[0]);
    if (left) {
      this.velocityPerSecond.X -= xVelocityChange;
      this.direction = Direction.left;
    }
    if (right) {
      this.velocityPerSecond.X += xVelocityChange;
      this.direction = Direction.right;
    }
    if (Math.abs(this.velocityPerSecond.X) > maxXvel) {
      this.velocityPerSecond.X = left ? -maxXvel : maxXvel;
    }
  }

  private processSlowDown(xVelocityChange:number):void {
    if (this.currentState === CharacterState.Jump) return;

    if (this.velocityPerSecond.X < 0) {
      this.velocityPerSecond.X += xVelocityChange;
      if (this.velocityPerSecond.X > 0) this.velocityPerSecond.X = 0;
    } else {
      this.velocityPerSecond.X -= xVelocityChange;
      if (this.velocityPerSecond.X < 0) this.velocityPerSecond.X = 0;
    }
  }

  private processJump():void {
    if (this.OnSurface) this.airJumps = 1;
    if (!this.conrols.has(Action.jump)) {
      this.jumpHold = false;
      return;
    }
    if (this.jumpHold) return;
    if (!this.OnSurface) {
      if (!this.airJumps) return;
      this.airJumps -= 1;
    } else this.surfaceType = null;
    // because surfaces are sticky (to prevent "floating" from stairs)
    this.velocityPerSecond.Y = -Character.jumpPower;
    this.jumpHold = true;
  }

  private processControls(elapsedSeconds:number):void {
    const run = this.conrols.has(Action.run);
    const left = this.conrols.has(Action.moveLeft);
    const right = this.conrols.has(Action.moveRight);
    const xVelChangePerSec = this.OnSurface
      ? (Character.cntrlChangeXVel[this.surfaceType as SurfaceType]
        || Character.cntrlChangeXVel.default)
      : Character.cntrlChangeXVel.air;

    const xVelocityChange = elapsedSeconds * (xVelChangePerSec as number);
    if (left || right) this.processWalk(run, left, right, xVelocityChange);
    else this.processSlowDown(xVelocityChange);

    this.processJump();
  }

  public frame(elapsedSeconds:number):void {
    this.processControls(elapsedSeconds);
    super.frame(elapsedSeconds);
  }
}

export default Character;
