import SpriteAnimation from '../sprites';
import Direction from '../helperTypes/direction';
import Point from '../helperTypes/point';
import StateConfig from './typeStateConfig';
import State from './typeState';

type States = Record<number, State>;

abstract class Entity {
  protected position:Point = Point.Zero;
  protected velocityPerSecond:Point = Point.Zero;
  private gravity = 100;
  private states:States = {};
  protected stateElapsedSeconds = 0;
  protected currentState = -1;
  private animation:SpriteAnimation | null = null;
  protected direction:Direction = Direction.right;

  public set State(value:number) {
    if (!this.states[value]) {
      this.currentState = -1;
      this.animation = null;
      return;
    }

    this.currentState = value;
    this.animation = this.states[this.currentState]?.animation || null;
  }

  private static concatBoxes<T>(box?:T, boxes?:T[]):T[] {
    return (boxes || []).concat(box || []);
  }

  private static initStates(states:Partial<Record<number, StateConfig>>) {
    return Object.keys(states).reduce((result:States, key:string) => {
      const stateCf:StateConfig = states[+key] as StateConfig;
      const hitboxes = Entity.concatBoxes(stateCf.hitbox, stateCf.hitboxes);
      const hurtboxes = Entity.concatBoxes(stateCf.hurtbox, stateCf.hurtboxes);
      const collisionboxesTmp = Entity.concatBoxes(stateCf.collisionbox, stateCf.collisionboxes);
      const collisionboxes = collisionboxesTmp.length ? collisionboxesTmp : hurtboxes;
      const state:State = { hitboxes, hurtboxes, collisionboxes };

      if (stateCf.spite) Object.assign(state, { animation: new SpriteAnimation(stateCf.spite) });
      Object.assign(result, { [+key]: state });
      return result;
    }, {});
  }

  constructor(position:Point, states?:Partial<Record<number, StateConfig>>, defaultState?:number) {
    this.position = position;
    if (!states) return;
    this.states = Entity.initStates(states);
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
    cLocal.fillRect(Math.round(this.position.X), Math.round(this.position.Y), 1, 1);
  }

  private drawBoxes(c:CanvasRenderingContext2D):void {
    if (this.currentState < 0) return;
    const state:StateConfig = this.states[this.currentState] as StateConfig;
    const pos = this.position;
    const reverse = !!this.direction;
    if (state.hurtbox) state.hurtbox.draw(c, Entity.clrs.hurt, pos, reverse);
    if (state.hurtboxes) state.hurtboxes.forEach((v) => v.draw(c, Entity.clrs.hurt, pos, reverse));
    if (state.hitbox) state.hitbox.draw(c, Entity.clrs.hit, pos, reverse);
    if (state.hitboxes) state.hitboxes.forEach((v) => v.draw(c, Entity.clrs.hit, pos, reverse));
    this.drawPosition(c);
  }

  public draw(c:CanvasRenderingContext2D, drawBoxes = false) {
    if (this.animation) {
      const elapsed = this.stateElapsedSeconds;
      this.animation.drawFrame(c, this.position, elapsed, !!this.direction);
    }
    if (drawBoxes) this.drawBoxes(c);
  }
}

export default Entity;
