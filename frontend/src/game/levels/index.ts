import {
  LevelConfig, LevelLoadingConfig as LoadZone, LevelEntityConfig,
  SurfaceType, LevelLoad as Load, LevelId,
} from './types';

import { Point, Line, Rectangle } from '../../shapes';

import { Entity, EntityClass } from '../entity';
import entitiesList from '../entity/list';

import Character from '../character';

type Surface = { type:SurfaceType, platform:boolean, position:Line } ;
type SurfaceCollision = { surface:Surface, point:Point } | null;
type Position = { position:Line };

class Level {
  private readonly surfaces:Surface[];
  private readonly loadEnter:LoadZone[];
  private readonly loadExit:LoadZone[];
  private readonly entitiesConfig:LevelEntityConfig[];
  private entities:Entity[] = [];
  private char?:Character;

  private static newEntity<A extends Entity>(EntityConstructor:EntityClass<A>, position:Point):A {
    return new EntityConstructor(position);
  }

  private static initEntities(entitiesConfig:LevelEntityConfig[]):Entity[] {
    return entitiesConfig.map((v) => Level.newEntity(entitiesList[v.type], v.position));
  }

  constructor(config:LevelConfig) {
    this.surfaces = config.surfaces
      .map((s) => ({ ...s, type: SurfaceType.Normal, platform: false }));
    this.entitiesConfig = config.entities;
    this.loadEnter = config.loading;
    this.loadExit = config.loading.filter((v) => v.zone !== undefined);
  }

  public load(char:Character, zone = 0, positionPercentage = 0, portal = false):void {
    if (!portal) this.entities = Level.initEntities(this.entitiesConfig);
    this.char = char;
    const loadPos:Line = this.loadEnter[
      zone < this.loadEnter.length ? zone : Math.floor(Math.random() * this.loadEnter.length)
    ].position;
    this.char.Position = loadPos.B.minus(loadPos.A).multiply(positionPercentage).plus(loadPos.A);
    this.char.frame(0.0001);
    // hack to not stuck at loading screen and not to process "just loaded" every frame
  }

  private static filterNear<T>(array:Position[], checkZone:Rectangle):T[] {
    return array
      .filter((s) => s.position.MinX <= checkZone.Right
                  && s.position.MaxX >= checkZone.Left
                  && s.position.MinY <= checkZone.Bottom
                  && s.position.MaxY >= checkZone.Top) as unknown as T[]; // is there a better way?
  }

  private static linesIntersect(line1:Line, line2:Line):number | null {
    const line1Vect:Point = line1.B.minus(line1.A);
    const line2Vect:Point = line2.B.minus(line2.A);

    const line2Pos = (line2Vect.X * (line1.A.Y - line2.A.Y) - line2Vect.Y * (line1.A.X - line2.A.X))
                   / (line1Vect.X * line2Vect.Y - line1Vect.Y * line2Vect.X);
    if (line2Pos < 0 || line2Pos > 1 || Number.isNaN(line2Pos)) return null;

    const line1Pos = (line1Vect.X * (line1.A.Y - line2.A.Y) - line1Vect.Y * (line1.A.X - line2.A.X))
                   / (line1Vect.X * line2Vect.Y - line2Vect.X * line1Vect.Y);
    if (line1Pos < 0 || line1Pos > 1 || Number.isNaN(line1Pos)) return null;

    return line2Pos;
  }

  private static pointPercentOnLine(p:number, s:number, l:number) {
    return Math.abs(p - s) / l;
  }

  private static processExitZones(exits:LoadZone[], move:Line):Load | null {
    if (!exits.length) return null;
    // should add sort check for 2 zones nearly and direction but I don't care
    for (let i = exits.length - 1; i > -1; i -= 1) {
      const exit = exits[i];
      const exitPos = exit.position;
      const position = Level.linesIntersect(exitPos, move);
      if (!position) continue;
      const levelId = exit.levelId as LevelId;
      const zone = exit.zone as number;
      return { levelId, zone, position };
    }
    return null;
  }

  private static processFloors(floors:Surface[], move:Line, onFloor:boolean):SurfaceCollision {
    if (!floors.length) return null;
    if (floors.length > 1) floors.sort((a, b) => b.position.MinY - a.position.MinY);
    // prevent teleport down with very low fps aka 10 seconds per frame

    for (let i = floors.length - 1; i > -1; i -= 1) {
      const floorPos = floors[i].position;
      const percentBefore = Level.pointPercentOnLine(move.A.X, floorPos.A.X, floorPos.DifXabs);
      const yBefore = floorPos.DifYabs * percentBefore + floorPos.MinY;
      if (yBefore < move.A.Y) continue; // platform was above the characrter
      const percentegeAfter = Level.pointPercentOnLine(move.B.X, floorPos.A.X, floorPos.DifXabs);
      const yAfter = floorPos.DifYabs * percentegeAfter + floorPos.MinY;
      if (!onFloor && yAfter >= move.B.Y) continue;
      return { surface: floors[i], point: new Point(move.B.X, yAfter) };
    }

    return null;
  }

  private static getCheckZone(move:Line):Rectangle {
    const top = Math.min(move.B.Y, move.A.Y);
    const height = Math.max(move.B.Y, move.A.Y) - top;
    const left = Math.min(move.B.X, move.A.X);
    const width = Math.max(move.B.X, move.A.X) - left;
    return new Rectangle(left, top, width, height);
  }

  private processCollision(e:Entity, elapsedSeconds:number, char = false):Load | null {
    const posBefore = new Point(e.Position.X, e.Position.Y); // to copy values and not reference
    e.frame(elapsedSeconds);
    const move = new Line(posBefore, e.Position);
    const checkZone = Level.getCheckZone(move);
    if (char) {
      const nearExits = Level.filterNear<LoadZone>(this.loadExit, checkZone);
      const exit = Level.processExitZones(nearExits, move);
      if (exit) return exit;
    }
    const floorsCheckZone = new Rectangle(move.B.X, checkZone.Top, 0, checkZone.Height);
    const nearFloors = Level.filterNear<Surface>(this.surfaces, floorsCheckZone);
    const floorCollision = Level.processFloors(nearFloors, move, e.OnSurface);

    if (floorCollision) {
      e.Position = floorCollision.point;
      e.SurfaceType = floorCollision.surface.type;
    } else e.SurfaceType = null;

    return null;
  }

  public frame(elapsedSeconds:number):Load | undefined {
    const char = this.char as Character;
    const exit = this.processCollision(char, elapsedSeconds, true);
    if (exit) return exit;
    this.entities?.forEach((entity) => this.processCollision(entity, elapsedSeconds));
    return undefined;
  }

  private static drawLine(c:CanvasRenderingContext2D, line:Line):void {
    c.moveTo(line.A.X, line.A.Y);
    c.lineTo(line.B.X, line.B.Y);
  }

  private static drawPositions(c:CanvasRenderingContext2D, pArr:Position[], color:string) {
    const cLocal = c;
    c.beginPath();
    cLocal.strokeStyle = color;
    pArr.forEach((pos) => Level.drawLine(c, pos.position));
    c.stroke();
    c.closePath();
  }

  public draw(c: CanvasRenderingContext2D, drawBoxes = false, drawSurfaces = false):void {
    this.char?.draw(c, drawBoxes);
    this.entities?.forEach((entity) => entity.draw(c, drawBoxes));
    if (drawSurfaces) {
      Level.drawPositions(c, this.surfaces, 'black');
      Level.drawPositions(c, this.loadEnter, 'white');
      Level.drawPositions(c, this.loadExit, 'yellow');
    }
  }
}

export default Level;
