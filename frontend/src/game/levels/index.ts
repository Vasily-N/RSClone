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
import Rectangle from '../helperTypes/rectangle';

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

  private static filterNear(surfaces:Surface[], checkZone:Rectangle):Surface[] {
    return surfaces
      .filter((s) => s.position.MinX <= checkZone.Right
                  && s.position.MaxX >= checkZone.Left
                  && s.position.MinY <= checkZone.Bottom
                  && s.position.MaxY >= checkZone.Top);
  }

  private static processFloors(floors:Surface[], move:Line, onFloor:boolean):SurfaceCollision {
    if (!floors.length) return undefined;
    if (floors.length > 1) floors.sort((a, b) => b.position.MinY - a.position.MinY);
    // prevent teleport down with very low fps aka 10 seconds per frame

    for (let i = floors.length - 1; i > -1; i -= 1) {
      const floor = floors[i];
      const percentegeBefore = (move.A.X - floor.position.MinX) / floor.position.DifX;
      const yBefore = floor.position.DifY * percentegeBefore + floor.position.MinY;
      if (yBefore < move.A.Y) continue; // platform was above the characrter
      const percentegeAfter = (move.B.X - floor.position.MinX) / floor.position.DifX;
      const yAfter = floor.position.DifY * percentegeAfter + floor.position.MinY;
      if (!onFloor && yAfter > move.B.Y) continue;
      return { surface: floor, point: new Point(move.B.X, yAfter) };
    }

    return undefined;
  }

  private processCollision(e:Entity, elapsedSeconds:number):unknown | undefined {
    const posBefore = new Point(e.Position.X, e.Position.Y); // to copy values and not reference
    e.frame(elapsedSeconds);

    const move = new Line(posBefore, e.Position);
    const top = Math.min(move.B.Y, move.A.Y);
    const checkZone = new Rectangle(move.B.X, top, 0, Math.max(move.B.Y, move.A.Y) - top);

    const nearFloors = Level.filterNear(this.surfaces, checkZone);
    const floorCollision = Level.processFloors(nearFloors, move, e.OnSurface);

    if (floorCollision) e.Position = floorCollision.point;
    e.Surface = floorCollision?.surface;

    return undefined;
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
