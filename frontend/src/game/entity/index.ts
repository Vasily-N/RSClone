import SpriteAnimation from '../sprites';
import Point from '../types/Point';
import State from './state.type';

type States = Partial<Record<number, State>>;

class Entity {
  protected position:Point = new Point(100, 100);
  protected velocityPerSecond:Point = new Point(0, 0);
  private gravity = 100;
  private states:States = {};
  protected stateElapsedSeconds = 0;
  protected currentState = -1;
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

  public frame(elapsedSeconds:number):void {
    this.stateElapsedSeconds += elapsedSeconds;
    this.velocityPerSecond.Y += elapsedSeconds * this.gravity;
    this.velocityPerSecond.Y = 0;
    this.position.X += elapsedSeconds * this.velocityPerSecond.X;
    this.position.Y += elapsedSeconds * this.velocityPerSecond.Y;
  }

  private static readonly clrs = { hit: 'red', hurt: 'blue', pos: 'green' };

  private drawPosition(c:CanvasRenderingContext2D):void {
    const cLocal = c;
    cLocal.strokeStyle = Entity.clrs.pos;
    cLocal.fillRect(this.position.X, this.position.Y, 1, 1);
  }

  private drawBoxes(c:CanvasRenderingContext2D):void {
    if (this.currentState < 0) return;
    const state:State = this.states[this.currentState] as State;
    if (state.hurtbox) state.hurtbox.draw(c, Entity.clrs.hurt, this.position);
    if (state.hurtboxes) state.hurtboxes.forEach((v) => v.draw(c, Entity.clrs.hurt, this.position));
    if (state.hitbox) state.hitbox.draw(c, Entity.clrs.hit, this.position);
    if (state.hitboxes) state.hitboxes.forEach((v) => v.draw(c, Entity.clrs.hit, this.position));
    this.drawPosition(c);
  }

  public draw(c:CanvasRenderingContext2D, drawBoxes = false) {
    if (!this.animation) return;
    this.animation.drawFrame(c, this.position, this.stateElapsedSeconds);
    if (drawBoxes) this.drawBoxes(c);
  }
}

export default Entity;
