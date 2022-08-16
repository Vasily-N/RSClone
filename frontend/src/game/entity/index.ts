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
    this.currentState = value;
    const sprite = this.states[this.currentState]?.spite;
    this.animation = (sprite) ? new SpriteAnimation(sprite) : null;
  }

  constructor(states?:States, defaultState?:number) {
    if (!states) return;
    this.states = states;
    this.State = defaultState || Number(Object.keys(states)[0]);
  }

  public frame(elapsed:number) {
    this.stateElapsed += elapsed;
    this.position.X += elapsed * this.velocityPerSecond.X;
    this.position.Y += elapsed * this.velocityPerSecond.Y;
  }

  public draw(c:CanvasRenderingContext2D) {
    if (!this.animation) return;
    this.animation.drawFrame(c, this.position, this.stateElapsed);
  }
}

export default Entity;
