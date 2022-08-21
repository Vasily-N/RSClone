import { Controls, ControlsAction as Action } from '../services/controls';
import { Entity, Direction } from '../entity';
import { Point } from '../../shapes';
import { CharacterState, states } from './states';
import SurfaceType from '../types';

type ChangeVelX = Partial<{ [t in SurfaceType]: number }> & {
  default: number
  air: number
};

class Character extends Entity {
  private readonly conrols:Controls;
  private static readonly maxVelX = { walk: 100, run: 180 };
  private static readonly changeVelX:ChangeVelX = {
    default: 1500, air: 700, [SurfaceType.Ice]: 400,
  };

  private airJumps = 1;
  private jumpHold = false;
  private static readonly jumpPower = 110; // todo: to character stats

  constructor(controls:Controls) {
    super(Point.Zero, states);
    this.conrols = controls;
  }

  private static getMaxVelX(run:boolean):number {
    return run ? Character.maxVelX.run : Character.maxVelX.walk;
  }

  private processWalk(run:boolean, left:boolean, right:boolean, xVelocityChange:number):void {
    const maxVelX = this.OnSurface
      ? Character.getMaxVelX(run)
      : Math.max(Math.abs(this.velocityPerSecond.X), Character.maxVelX.walk);
    if (left) {
      this.velocityPerSecond.X -= xVelocityChange;
      this.direction = Direction.left;
    }
    if (right) {
      this.velocityPerSecond.X += xVelocityChange;
      this.direction = Direction.right;
    }
    if (Math.abs(this.velocityPerSecond.X) > maxVelX) {
      this.velocityPerSecond.X = left ? -maxVelX : maxVelX;
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
      ? (Character.changeVelX[this.surfaceType as SurfaceType]
        || Character.changeVelX.default)
      : Character.changeVelX.air;

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
