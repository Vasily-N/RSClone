import SpriteAnimation from '../sprites';
import Point from '../types/Point';
import State from './state.type';

type States = Partial<Record<number, State>>;

class Entity {
  private position:Point = new Point(100, 100);
  private velocityPerSecond:Point = new Point(0, 0);
  private states:States = {};
  private stateElapsed = 0;
  private currentState = -1;
  private animation:SpriteAnimation | null = null;

  public set State(value:number) {
    if (!this.states[value]) {
      this.currentState = -1;
      this.animation = null;
      return;
    }

    this.currentState = value;
    const sprite = this.states[this.currentState]?.spite;
    this.animation = (sprite) ? new SpriteAnimation(sprite) : null;
  }

  constructor(states?:States, defaultState?:number) {
    if (!states) return;
    this.states = states;
    this.State = defaultState || Number(Object.keys(states)[0]);
  }

  public frame(elapsed:number):void {
    this.stateElapsed += elapsed;
    this.position.X += elapsed * this.velocityPerSecond.X;
    this.position.Y += elapsed * this.velocityPerSecond.Y;
  }

  private static readonly hitBoxC = 'red';
  private static readonly hurtBoxC = 'blue';

  private drawBoxes(c:CanvasRenderingContext2D):void {
    if (this.currentState < 0) return;
    const state:State = this.states[this.currentState] as State;
    if (state.hurtbox) state.hurtbox.draw(c, Entity.hurtBoxC, this.position);
    if (state.hurtboxes) state.hurtboxes.forEach((v) => v.draw(c, Entity.hurtBoxC, this.position));
    if (state.hitbox) state.hitbox.draw(c, Entity.hitBoxC, this.position);
    if (state.hitboxes) state.hitboxes.forEach((v) => v.draw(c, Entity.hitBoxC, this.position));
  }

  public draw(c:CanvasRenderingContext2D, drawBoxes = false) {
    if (!this.animation) return;
    this.animation.drawFrame(c, this.position, this.stateElapsed);
    if (drawBoxes) this.drawBoxes(c);
  }
}

export default Entity;
