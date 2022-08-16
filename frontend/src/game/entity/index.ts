import SpriteAnimation from '../sprites';
import Point from '../types/Point';
import State from './state.type';

type States = Partial<Record<number, State>>;

class Entity {
  private position:Point = new Point(0, 0);
  private velocityPerSecond:Point = new Point(0, 0);
  private states:States = {};
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

  public frame(frametime:number) {
    this.position.X += frametime * this.velocityPerSecond.X;
    this.position.Y += frametime * this.velocityPerSecond.Y;
  }

  public draw(c:CanvasRenderingContext2D) {
    if (!this.animation) return;
    c.drawImage(this.animation.imgSource, 0, 0, 26, 43, 100, 50, 26, 43); // temporal
  }
}

export default Entity;
