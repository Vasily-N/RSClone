import Controls from '../controls';
import Action from '../controls/actions.enum';
import Entity from '../entity';
import Direction from '../helperTypes/direction';
import Point from '../helperTypes/point';
import SurfaceType from '../levels/typeSurface';
import { CharacterState, states } from './states';

class Character extends Entity {
  private readonly conrols:Controls;
  private static readonly cntrlMaxXVel:Record<number, number> = { [+false]: 100, [+true]: 200 };
  private static readonly cntrlChangeXVelDefault:number = 1500;
  private static readonly cntrlChangeXVelSurface:Partial<Record<SurfaceType, number>> = {
    [SurfaceType.Ice]: 50,
  };

  private jumps = 1;
  private jumpHold = false;
  private static readonly jumpPower = 120; // todo: to character stats

  constructor(controls:Controls) {
    super(Point.Zero, states);
    this.conrols = controls;
  }

  private processWalk(run:boolean, left:boolean, right:boolean, xVelocityChange:number):void {
    const maxXvel = Character.cntrlMaxXVel[+run];
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
    if (!this.conrols.has(Action.jump)) {
      this.jumpHold = false;
      return;
    }
    if (this.jumpHold) return;
    if (this.surface) this.jumps = 2;
    if (!this.jumps) return;
    this.surface = undefined; // because surfaces are sticky (to prevent "floating" from stairs)
    this.velocityPerSecond.Y = -Character.jumpPower;
    this.position.Y -= 1; // "hack" against surface magnit with high refresh rate
    this.jumps -= 1;
    this.jumpHold = true;
  }

  private processControls(elapsedSeconds:number):void {
    const run = this.conrols.has(Action.run);
    const left = this.conrols.has(Action.moveLeft);
    const right = this.conrols.has(Action.moveRight);
    const xVelChangePerSec = (this.surface && this.surface.type
                              && Character.cntrlChangeXVelSurface[this.surface.type])
                              || Character.cntrlChangeXVelDefault;
    if (xVelChangePerSec !== Character.cntrlChangeXVelDefault) console.log(xVelChangePerSec);
    const xVelocityChange = elapsedSeconds * xVelChangePerSec;
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
