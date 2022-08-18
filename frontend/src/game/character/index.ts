import Controls from '../controls';
import Action from '../controls/actions.enum';
import Entity from '../entity';
import Direction from '../types/direction';
import { CharacterState, states } from './states';

class Character extends Entity {
  private readonly conrols:Controls;
  private static readonly cntrlMaxXVel:Record<number, number> = { [+false]: 100, [+true]: 200 };
  private static readonly cntrlChangeXVel:number = 1500;

  constructor(controls:Controls) {
    super(states);
    this.conrols = controls;
  }

  private processWalk(run:boolean, left:boolean, right:boolean, xVelocityChange:number) {
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

  private processControls(elapsedSeconds:number) {
    const run = this.conrols.has(Action.run);
    const left = this.conrols.has(Action.moveLeft);
    const right = this.conrols.has(Action.moveRight);
    const xVelocityChange = elapsedSeconds * Character.cntrlChangeXVel;
    if (left || right) this.processWalk(run, left, right, xVelocityChange);
    else this.processSlowDown(xVelocityChange);
  }

  public frame(elapsedSeconds:number):void {
    this.processControls(elapsedSeconds);
    super.frame(elapsedSeconds);
  }
}

export default Character;
