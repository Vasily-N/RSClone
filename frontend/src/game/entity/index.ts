import {
  Direction, EntityClass, EntityId, StateConfig,
} from './types';

import { SpriteAnimation, SpriteConfig } from '../spriteAnimation';

import { Point, Rectangle } from '../shapes';
import Box from '../box';
import SurfaceType from '../types';
import { Surface } from '../levels/types';

type State = {
  animation?:SpriteAnimation;
  hitboxes:Box[];
  hurtboxes:Box[];
  collisionboxes:Box[];
};

type States = Record<number, State>;

abstract class Entity {
  protected direction:Direction = Direction.right;
  public get Direction():Direction { return this.direction; }
  protected position:Point = Point.Zero;
  public get Position():Point { return this.position; }
  protected velocityPerSecond:Point = Point.Zero;
  private static readonly maxVelY = 400;

  private gravity = 230;
  private states:States = {};
  protected stateElapsedSeconds = 0;

  protected stateCurrent = -1;
  protected animation:SpriteAnimation | null = null;
  private collisionBox:Box | null = null;
  public get Collision():Rectangle {
    return (this.collisionBox?.getRect(!!this.direction) || Rectangle.Zero);
  }

  protected platform = false;
  protected surfaceType:SurfaceType | null = null;
  protected set SurfaceType(value:SurfaceType | null) {
    this.surfaceType = value;
    if (value !== null) this.resetVelocityY();
  }

  public set Surface(value:Surface | null) {
    this.SurfaceType = value && value.type;
    this.platform = !!value && value.platform;
  }

  public get OnSurface():boolean { return this.surfaceType !== null; }

  // because I'm too dumb to code it correctly with very limited time
  private static getCollisionSimplified(boxes:Box[]):Rectangle {
    return boxes
      .map((b) => b.getRect())
      .reduce((p, c) => Box.initCombined(p, c), new Rectangle(0, 0, 0, 0));
  }

  public set State(value:number) {
    if (!this.states[value]) {
      this.stateCurrent = -1;
      this.animation = null;
      this.collisionBox = null;
      return;
    }
    if (value === this.stateCurrent) return;
    this.stateElapsedSeconds = 0;
    this.stateCurrent = value;
    [this.collisionBox] = this.states[this.stateCurrent].collisionboxes;
    this.animation = this.states[this.stateCurrent].animation || null;
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
      const collisionboxes = [
        new Box(Entity.getCollisionSimplified(
          collisionboxesTmp.length ? collisionboxesTmp : hurtboxesTmp,
        ), true), // temp shit
      ];
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

  public frame(elapsedSeconds:number):boolean {
    this.stateElapsedSeconds += elapsedSeconds;

    if (!this.OnSurface && this.velocityPerSecond.Y < Entity.maxVelY) {
      this.velocityPerSecond.Y += elapsedSeconds * this.gravity;
      this.velocityPerSecond.Y = Math.min(this.velocityPerSecond.Y, Entity.maxVelY);
    }

    this.position.Y += elapsedSeconds * this.velocityPerSecond.Y;
    this.position.X += elapsedSeconds * this.velocityPerSecond.X;
    return false;
  }

  public resetVelocityX() {
    this.velocityPerSecond.X = 0;
  }

  public resetVelocityY(negativeOnly = false, positiveOnly = false) {
    if ((!negativeOnly && !positiveOnly)
      || (negativeOnly && this.velocityPerSecond.Y < 0)
      || (positiveOnly && this.velocityPerSecond.Y > 0)) {
      this.velocityPerSecond.Y = this.gravity / 5;
    }
  }

  private static readonly colors = {
    hit: 'red', hurt: 'blue', collision: 'fuchsia', position: 'green',
  };

  private static drawPosition(c:CanvasRenderingContext2D, drawPos:Point):void {
    const cLocal = c;
    cLocal.strokeStyle = Entity.colors.position;
    cLocal.fillRect(Math.round(drawPos.X), Math.round(drawPos.Y), 1, 1);
  }

  private drawBoxes(c:CanvasRenderingContext2D, zoom:number, drawPos:Point):void {
    if (this.stateCurrent < 0) return;
    const state = this.states[this.stateCurrent];
    const reverse = !!this.direction;
    const cLocal = c;
    c.translate(0.5, 0.5);
    cLocal.strokeStyle = Entity.colors.collision;
    state.collisionboxes.forEach((v) => v.draw(c, drawPos, zoom, reverse));
    cLocal.strokeStyle = Entity.colors.hurt;
    state.hurtboxes.forEach((v) => v.draw(c, drawPos, zoom, reverse));
    cLocal.strokeStyle = Entity.colors.hit;
    state.hitboxes.forEach((v) => v.draw(c, drawPos, zoom, reverse));
    Entity.drawPosition(c, drawPos);
    c.translate(-0.5, -0.5);
  }

  public draw(c:CanvasRenderingContext2D, camPos:Point, zoom:number, drawBoxes = false) {
    const drawPos = this.position.multiply(zoom).minus(camPos);
    if (this.animation) {
      const elapsed = this.stateElapsedSeconds;
      this.animation.drawFrame(c, drawPos, zoom, elapsed, !!this.direction);
    }
    if (drawBoxes) this.drawBoxes(c, zoom, drawPos);
  }

  protected static animationFinished(anim:SpriteAnimation, elapsedSeconds:number):boolean {
    return anim.Ends <= elapsedSeconds;
  }
}

export {
  Entity, EntityClass, Direction, EntityId, StateConfig, SpriteConfig,
};
