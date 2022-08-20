import SpriteAnimation from '../sprites';
import Direction from '../helperTypes/direction';
import Point from '../helperTypes/point';
import StateConfig from './typeStateConfig';
import State from './typeState';
import Box from '../box';
import Rectangle from '../helperTypes/rectangle';
import { SurfaceConfig } from '../levels/typeConfigs';

type States = Record<number, State>;

abstract class Entity {
  protected direction:Direction = Direction.right;
  protected position:Point = Point.Zero;
  public set Position(value:Point) { this.position = value; }
  public get Position():Point { return this.position; }
  protected velocityPerSecond:Point = Point.Zero;
  private gravity = 100;
  private states:States = {};
  protected stateElapsedSeconds = 0;

  protected currentState = -1;
  private animation:SpriteAnimation | null = null;
  private collision:Rectangle = Rectangle.Zero;
  public get Collision():Rectangle { return this.collision; }

  protected surface:SurfaceConfig | null = null;
  public set Surface(value:SurfaceConfig | null) {
    if (value) this.velocityPerSecond.Y = 0;
    else if (this.surface) this.velocityPerSecond.Y = this.gravity / 1.8;
    this.surface = value;
  }

  public get OnSurface():boolean { return !!this.surface; }

  // because I'm too dumb to code it correctly with very limited time
  private static getCollisionSimplified(boxes:Box[]):Rectangle {
    return boxes.map((b) => b.RectCombined).reduce((p, c) => Box.initCombined(p, c));
  }

  public set State(value:number) {
    if (!this.states[value]) {
      this.currentState = -1;
      this.animation = null;
      this.collision = Rectangle.Zero;
      return;
    }

    this.currentState = value;
    this.collision = Entity.getCollisionSimplified(this.states[this.currentState].collisionboxes);
    this.animation = this.states[this.currentState].animation || null;
  }

  private static concatBoxes<T>(box?:T, boxes?:T[]):T[] {
    return (boxes || []).concat(box || []);
  }

  private static initStates(states:Partial<Record<number, StateConfig>>) {
    return Object.keys(states).reduce((result:States, key:string) => {
      const stateCf:StateConfig = states[+key] as StateConfig;
      const hitboxes = Entity.concatBoxes(stateCf.hitbox, stateCf.hitboxes);
      const hurtboxesTmp = Entity.concatBoxes(stateCf.hurtbox, stateCf.hurtboxes);
      const hurtboxes = hurtboxesTmp.length ? hurtboxesTmp : hitboxes;
      const collisionboxesTmp = Entity.concatBoxes(stateCf.collisionbox, stateCf.collisionboxes);
      const collisionboxes = collisionboxesTmp.length ? collisionboxesTmp : hurtboxesTmp;
      const state:State = { hitboxes, hurtboxes, collisionboxes };

      if (stateCf.sprite) Object.assign(state, { animation: new SpriteAnimation(stateCf.sprite) });
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

    if (!this.surface) {
      this.velocityPerSecond.Y += elapsedSeconds * this.gravity;
      this.position.Y += elapsedSeconds * this.velocityPerSecond.Y;
    }

    this.position.X += elapsedSeconds * this.velocityPerSecond.X;
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
