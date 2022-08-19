import {
  LevelConfig, LoadingConfig as LoadZone, SurfaceConfig as Surface, EntityConfig,
} from './typeConfigs';
import SurfaceType from './typeSurface';

import Point from '../helperTypes/point';
import Entity from '../entity';

import entitiesList from '../entity/list';
import EntityClass from '../entity/typeClass';
import Character from '../character';
import Line from '../helperTypes/line';

type SurfaceCollision = { surface:Surface, point:Point } | undefined;

class Level {
  private readonly surfaces:Surface[];
  private readonly loadEnter:LoadZone[];
  private readonly loadExit:LoadZone[];
  private readonly entitiesConfig:EntityConfig[];
  private entities:Entity[] = [];
  private char?:Character;

  private static newEntity<A extends Entity>(EntityConstructor:EntityClass<A>, position:Point):A {
    return new EntityConstructor(position);
  }

  private static initEntities(entitiesConfig:EntityConfig[]):Entity[] {
    return entitiesConfig.map((v) => Level.newEntity(entitiesList[v.type], v.position));
  }

  constructor(config:LevelConfig) {
    this.surfaces = config.surfaces.map((s) => ({ ...s, type: SurfaceType.Normal }));
    this.entitiesConfig = config.entities;
    this.loadEnter = config.loading;
    this.loadExit = config.loading.filter((v) => v.zone !== undefined);
  }

  public load(char:Character, zone = 0, positionPercentage = 0):void {
    this.entities = Level.initEntities(this.entitiesConfig);
    this.char = char;
    const loadPos:Line = this.loadEnter[
      zone < this.loadEnter.length ? zone : Math.floor(Math.random() * this.loadEnter.length)
    ].position;
    const position:Point = loadPos.B.minus(loadPos.A).multiply(positionPercentage).plus(loadPos.A);
    this.char.Position = position;
  }

  private gravityCollision(posBefore:Point, posAfter:Point, onFloor:boolean):SurfaceCollision {
    const surfaces = this.surfaces
      .filter((s) => s.position.MinX <= posAfter.X
                  && s.position.MaxX >= posAfter.X
                  && s.position.MinY <= Math.max(posAfter.Y, posBefore.Y)
                  && s.position.MaxY >= Math.min(posAfter.Y, posBefore.Y));
    if (!surfaces.length) return undefined;
    if (surfaces.length > 1) surfaces.sort((a, b) => a.position.MinY - b.position.MinY);
    // prevent teleport down with very low fps aka 10 seconds per frame

    for (let i = 0; i < surfaces.length; i += 1) {
      const surface = surfaces[i];
      const percentegeBefore = (posBefore.X - surface.position.MinX) / surface.position.DifX;
      const yBefore = surface.position.DifY * percentegeBefore + surface.position.MinY;
      if (yBefore < Math.floor(posBefore.Y)) continue;
      const percentegeAfter = (posAfter.X - surface.position.MinX) / surface.position.DifX;
      const yAfter = Math.floor(surface.position.DifY * percentegeAfter + surface.position.MinY);
      if (!onFloor && yAfter > Math.ceil(posAfter.Y)) continue;
      return { surface, point: new Point(posAfter.X, yAfter) };
    }

    return undefined;
  }

  private processCollision(e:Entity, elapsedSeconds:number) {
    const posBefore = new Point(e.Position.X, e.Position.Y);
    e.frame(elapsedSeconds);
    const collision = this.gravityCollision(posBefore, e.Position, e.OnSurface);
    if (collision) {
      e.Position = collision.point;
    }

    e.Surface = collision?.surface;
  }

  public frame(elapsedSeconds:number):void {
    const char = this.char as Character;
    this.processCollision(char, elapsedSeconds);
    this.entities?.forEach((entity) => entity.frame(elapsedSeconds));
  }

  private static drawSurface(c:CanvasRenderingContext2D, surface:Surface):void {
    c.moveTo(surface.position.A.X, surface.position.A.Y);
    c.lineTo(surface.position.B.X, surface.position.B.Y);
  }

  public draw(c: CanvasRenderingContext2D, drawBoxes?: boolean):void {
    this.char?.draw(c, drawBoxes);
    this.entities?.forEach((entity) => entity.draw(c, drawBoxes));
    if (drawBoxes) {
      const cLocal = c;
      cLocal.strokeStyle = 'black';
      this.surfaces.forEach((surface) => Level.drawSurface(c, surface));
      c.stroke();
    }
  }
}

export default Level;
