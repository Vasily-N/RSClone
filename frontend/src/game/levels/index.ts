import { LevelLoad as Load, LevelId } from './types';
import {
  LevelConfig, LoadingConfig as LoadZone, EntityConfig, SurfaceConfig,
} from './levelConfig';

import { Point, Line, Rectangle } from '../shapes';

import { Entity, EntityClass } from '../entity';
import entitiesList from '../entity/list';

import SurfaceType from '../types';

import Character from '../character';

type Surface = { type:SurfaceType, platform:boolean, position:Line, angle:number } ;
enum SurfaceGroup { All, Walls, Floors, Ceils, Platforms } // Floors = Ceils + Platforms
type Surfaces = Record<SurfaceGroup, Surface[]>;

type FloorCollision = { surface?:Surface, point:Point } | null;
type Position = { position:Line };
type RenderContext = CanvasRenderingContext2D;

class Level {
  private readonly surfaces:Surfaces;
  private readonly loadEnter:LoadZone[];
  private readonly loadExit:LoadZone[];
  private readonly entitiesConfig:EntityConfig[];
  private entities:Entity[] = [];
  private char?:Character;

  private area:Rectangle;
  private cameraTarget:Point = Point.Zero;
  private cameraCurrent:Point = Point.Zero;
  private static readonly cameraSpeed = 180;
  private static readonly cameraShift = new Point(1 / 15, 6 / 11);
  private lastZoom = -1;
  private lastViewSize = Point.Zero;

  private static newEntity<A extends Entity>(EntityConstructor:EntityClass<A>, position:Point):A {
    return new EntityConstructor(position);
  }

  private static initEntities(entitiesConfig:EntityConfig[]):Entity[] {
    return entitiesConfig.map((v) => Level.newEntity(entitiesList[v.type], v.position));
  }

  private static getAngle(line:Line):number {
    const vector = line.A.minus(line.B);
    return Math.atan2(vector.Y, vector.X);
  }

  private static readonly wallAngle = (0 * Math.PI) / 180; // no not straight walls physics
  private static initSurfaces(surfaces:SurfaceConfig[]):Record<SurfaceGroup, Surface[]> {
    const allBeforeNormalizaion = surfaces.map((s) => ({
      platform: false, type: SurfaceType.Normal, ...s, angle: Level.getAngle(s.position),
    }));
    const halfPI = Math.PI / 2;
    const all = allBeforeNormalizaion.map((s) => (s.angle > 0
      ? { ...s, position: new Line(s.position.B, s.position.A), angle: Math.abs(s.angle - halfPI) }
      : { ...s, angle: Math.abs(s.angle + halfPI) }));

    const walls = all.filter((s) => s.angle <= Level.wallAngle);
    const floors = all.filter((s) => s.angle > Level.wallAngle);
    const ceils = floors.filter((s) => !s.platform);
    const platforms = floors.filter((s) => s.platform);

    return {
      [SurfaceGroup.All]: all,
      [SurfaceGroup.Walls]: walls,
      [SurfaceGroup.Floors]: floors,
      [SurfaceGroup.Ceils]: ceils,
      [SurfaceGroup.Platforms]: platforms,
    };
  }

  private static initArea(surface:Surface[], minSize:Point):Rectangle {
    const left = surface.reduce((p, c) => Math.min(p, c.position.MinX), Number.MAX_SAFE_INTEGER);
    const right = surface.reduce((p, c) => Math.max(p, c.position.MaxX), 0);
    const width = Math.max(right - left + 1, minSize.X);
    const top = surface.reduce((p, c) => Math.min(p, c.position.MinY), Number.MAX_SAFE_INTEGER);
    const bottom = surface.reduce((p, c) => Math.max(p, c.position.MaxY), 0);
    const height = Math.max(bottom - top + 1, minSize.Y);
    return new Rectangle(left - 1, top - 1, width + 1, height + 1);
  }

  constructor(config:LevelConfig) {
    this.surfaces = Level.initSurfaces(config.surfaces);
    this.area = Level.initArea(this.surfaces[SurfaceGroup.All], config.minSize);

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
    this.lastZoom = -1;
    this.char.SurfaceType = null;
    const pos = loadPos.B.minus(loadPos.A).multiply(positionPercentage).plus(loadPos.A);
    this.char.Position.X = pos.X;
    this.char.Position.Y = pos.Y;
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

  private static getCheckZone(move:Line):Rectangle {
    const top = Math.floor(move.MinY);
    const height = Math.ceil(move.MaxY - top);
    const left = Math.floor(move.MinX);
    const width = Math.ceil(move.MaxX - left);
    return new Rectangle(left, top, width, height);
  }

  private static processExitZones(loadExit:LoadZone[], move:Line):Load | null {
    const exits = Level.filterNear<LoadZone>(loadExit, Level.getCheckZone(move));
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

  private static processFloorsDot(
    e:Entity,
    floors:Surface[],
    move:Line,
    onFloor:boolean,
  ):FloorCollision {
    if (!floors.length) return null;
    if (floors.length > 1) floors.sort((a, b) => b.position.MaxY - a.position.MaxY);
    // prevent teleport down with very low fps aka 10 seconds per frame

    for (let i = floors.length - 1; i > -1; i -= 1) {
      const floorPos = floors[i].position;
      const percentBefore = Level.pointPercentOnLine(move.A.X, floorPos.A.X, floorPos.DifXabs);
      const yBefore = floorPos.DifYabs * percentBefore + floorPos.MinY;
      if (yBefore < move.A.Y - (onFloor ? e.Collision.Height : 0)) continue;
      // platform was above the characrter
      const percentegeAfter = Level.pointPercentOnLine(move.B.X, floorPos.A.X, floorPos.DifXabs);
      const yAfter = floorPos.DifYabs * percentegeAfter + floorPos.MinY;
      if (!onFloor && yAfter > move.B.Y) continue;
      return { surface: floors[i], point: new Point(move.B.X, yAfter) };
    }

    return null;
  }

  private static processFloorSub(
    e:Entity,
    surfaces:Surface[],
    zone:Rectangle,
    move:Line,
    onFloor:boolean,
  ):FloorCollision {
    const nearFloors = Level.filterNear<Surface>(surfaces, zone);
    return Level.processFloorsDot(e, nearFloors, move, onFloor);
  }

  private static processFloor(e:Entity, surfaces:Surface[], move:Line):FloorCollision {
    const checkTop = Math.floor(move.MinY - e.Collision.Height);
    const checkHeight = Math.ceil(move.MaxY - checkTop + e.Collision.Height);
    const dotZone = new Rectangle(move.B.X, checkTop, 0, checkHeight);

    const floorCollisionDotPos = Level.processFloorSub(e, surfaces, dotZone, move, e.OnSurface);
    if (floorCollisionDotPos) return floorCollisionDotPos;
    return null;
    const col = e.Collision.plusPoint(e.Position);
    const colZone = new Rectangle(col.Left, checkTop, col.Width, checkHeight);
    return Level.processFloorSub(e, surfaces, colZone, move, e.OnSurface);
  }

  private static processCeilDot(floors:Surface[], move:Line):FloorCollision {
    if (!floors.length) return null;
    if (floors.length > 1) floors.sort((a, b) => -(b.position.MaxY - a.position.MaxY));
    // prevent teleport down with very low fps aka 10 seconds per frame

    for (let i = floors.length - 1; i > -1; i -= 1) {
      const floorPos = floors[i].position;
      const percentBefore = Level.pointPercentOnLine(move.A.X, floorPos.A.X, floorPos.DifXabs);
      const yBefore = floorPos.DifYabs * percentBefore + floorPos.MinY;
      if (yBefore > move.A.Y) continue; // platform was below the characrter
      const percentegeAfter = Level.pointPercentOnLine(move.B.X, floorPos.A.X, floorPos.DifXabs);
      const yAfter = floorPos.DifYabs * percentegeAfter + floorPos.MinY;
      if (yAfter < move.B.Y) continue;
      return { surface: floors[i], point: new Point(move.B.X, yAfter) };
    }

    return null;
  }

  private static processCeil(surfaces:Surface[], e:Entity, move:Line):FloorCollision {
    const col = e.Collision.plusPoint(e.Position);
    const move2 = new Line(
      new Point(move.A.X, move.A.Y - col.Height),
      new Point(move.B.X, move.B.Y - col.Height),
    );
    const top = Math.floor(move2.MinY);
    const hght = Math.ceil(move2.MaxY - top);
    const ceilsZone = new Rectangle(Math.ceil(col.Left + 1), top, Math.floor(col.Width - 2), hght);
    const nearFloors = Level.filterNear<Surface>(surfaces, ceilsZone);
    return Level.processCeilDot(nearFloors, move2);
  }

  private static RayVsRect(ray:Line, target:Rectangle):Line | null {
    const rayPos = ray.A; const direction = ray.Direction;
    const invdir:Point = new Point(1.0 / direction.X, 1.0 / direction.Y);
    const tNear:Point = target.Position.minus(rayPos).multiplyPoint(invdir);
    const tFar:Point = target.BottomRight.minus(rayPos).multiplyPoint(invdir);

    if (Number.isNaN(tFar.Y) || Number.isNaN(tFar.X)) return null;
    if (Number.isNaN(tNear.Y) || Number.isNaN(tNear.X)) return null;

    if (tNear.X > tFar.X) [tNear.X, tFar.X] = [tFar.X, tNear.X];
    if (tNear.Y > tFar.Y) [tNear.Y, tFar.Y] = [tFar.Y, tNear.Y];
    if (tNear.X > tFar.Y || tNear.Y > tFar.X) return null;
    const tHitNear:number = Math.max(tNear.X, tNear.Y);
    const tHitFar:number = Math.min(tFar.X, tFar.Y);

    if (tHitFar < 0) return null;

    const contact1 = rayPos.plus(direction.multiply(tHitNear));
    const contact2 = rayPos.plus(direction.multiply(tHitFar));

    return new Line(contact1, contact2);
  }

  private static processWalls(surfaces:Surface[], e:Entity, move:Line):FloorCollision {
    const colVal = e.Collision;
    const colPos = colVal.plusPoint(e.Position);
    const colPrev = colPos.minusPoint(move.Direction);
    const zoneCheck = Rectangle.fromLine(new Line(
      new Point(Math.min(colPos.Left, colPrev.Left), Math.min(colPos.Top, colPrev.Top)),
      new Point(Math.max(colPos.Right, colPrev.Right), Math.max(colPos.Bottom, colPrev.Bottom)),
    ));

    const nearWalls = Level.filterNear<Surface>(surfaces, zoneCheck);
    for (let i = nearWalls.length - 1; i > -1; i -= 1) {
      const walPos = nearWalls[i].position;
      const res = this.RayVsRect(walPos, colPos);
      if (res) {
        if (colPrev.Bottom <= walPos.MinY) {
          return { surface: nearWalls[i], point: new Point(move.B.X, walPos.MinY) };
        }
        if (colPrev.Top >= walPos.MaxY) {
          return { point: new Point(move.B.X, walPos.MaxY + colVal.Top) };
        }
        if (res?.A.X === res?.B.X) {
          return {
            point: new Point(
              colPrev.X < colPos.X ? walPos.MinX - colVal.Right : walPos.MaxX - colVal.Left,
              move.B.Y,
            ),
          };
        }
        throw new Error('why do you have not straigh walls?!');
      }
    }
    return null;
  }

  private static processCeil2(surfaces:Surface[], e:Entity, move:Line):FloorCollision | null {
    const colVal = e.Collision;
    const colPos = colVal.plusPoint(e.Position);
    const colPrev = colPos.minusPoint(move.Direction);
    const nearCeils = Level.filterNear<Surface>(surfaces, colPos);
    for (let i = nearCeils.length - 1; i > -1; i -= 1) {
      const ceilPos = nearCeils[i].position;
      const res = Level.RayVsRect(ceilPos, colPos);
      if (!res) continue;
      if (Math.abs(ceilPos.MinX - res.A.X) < Math.abs(res.B.X - ceilPos.MaxX)) {
        if (ceilPos.MinX < colPos.Left) continue;
        const y = ceilPos.MinX === ceilPos.B.X ? ceilPos.B.Y : ceilPos.A.Y;
        const b = (ceilPos.MinY !== ceilPos.MaxY) && (y === ceilPos.MinY) ? 0.48 : 0;
        if (colPrev.Bottom <= (y + b)) {
          if (colPos.Bottom < y - b) continue;
          return { surface: nearCeils[i], point: new Point(move.B.X, y - colVal.Bottom - b) };
        }
        if (ceilPos.MinX + 4 < colPrev.Right) continue;
        return { point: new Point(ceilPos.MinX - colVal.Right, move.B.Y) };
      }

      if (ceilPos.MaxX > colPos.Right) continue;
      const y = ceilPos.MaxX === ceilPos.A.X ? ceilPos.A.Y : ceilPos.B.Y;
      const b = (ceilPos.MinY !== ceilPos.MaxY) && (y === ceilPos.MinY) ? 0.48 : 0;
      if (colPrev.Bottom <= (y + b)) {
        if (colPos.Bottom < y - b) continue;
        return { surface: nearCeils[i], point: new Point(move.B.X, y - colVal.Bottom - b) };
      }
      if (ceilPos.MaxX - 4 > colPrev.Left) continue;
      return { point: new Point(ceilPos.MaxX - colVal.Left, move.B.Y) };
    }
    return null;
  }

  private processCollisions(e:Entity, elapsedSeconds:number, char = false):Load | null {
    const posBefore = new Point(e.Position.X, e.Position.Y); // to copy values and not the reference
    e.frame(elapsedSeconds);
    const move = new Line(posBefore, e.Position);
    if (char) {
      const exit = Level.processExitZones(this.loadExit, move);
      if (exit) return exit;
    }

    const ceilCollision = Level.processCeil(this.surfaces[SurfaceGroup.Ceils], e, move);
    if (ceilCollision) {
      e.Position.Y = ceilCollision.point.Y + e.Collision.Height;
      e.resetVelocityY(true);
    }

    const floorCollision = Level.processFloor(e, this.surfaces[SurfaceGroup.Floors], move);
    if (floorCollision) {
      e.Position.Y = floorCollision.point.Y;
      if (floorCollision.surface) e.SurfaceType = floorCollision.surface.type;
    } else e.SurfaceType = null;

    const wallsCollision = Level.processWalls(this.surfaces[SurfaceGroup.Walls], e, move)
      || (!floorCollision && !ceilCollision
        && Level.processCeil2(this.surfaces[SurfaceGroup.Ceils], e, move));
    if (wallsCollision) {
      if (wallsCollision.surface) {
        e.resetVelocityY();
        e.SurfaceType = wallsCollision.surface.type;
      } else if (!floorCollision) e.SurfaceType = null;

      if (e.Position.X !== wallsCollision.point.X) e.resetVelocityX();
      e.Position.X = wallsCollision.point.X;
      e.Position.Y = wallsCollision.point.Y;
    }

    return null;
  }

  private processCamera(char:Character, viewSize:Point, zoom:number, elapsedSeconds:number) {
    // some doublicate-code, I wasn't able to find how in TS dynamically access setters field
    // I specially used Size[key] instead of Width/Height to easily see the doublicate-code

    // Y is always centered so no code for Y-camera-movement
    const areaZoom = this.area.multiply(zoom);
    if (viewSize.X > areaZoom.Size.X) {
      this.cameraTarget.X = (areaZoom.Size.X - viewSize.X) / 2;
      this.cameraCurrent.X = this.cameraTarget.X;
    } else {
      const shiftX = 0.5 + (char.Direction ? Level.cameraShift.X : -Level.cameraShift.X);
      const newCameraX = zoom * char.Position.X - viewSize.X * shiftX;
      const maxPosX = areaZoom.Size.X - viewSize.X;
      this.cameraTarget.X = Math.min(Math.max(newCameraX, areaZoom.X), maxPosX);
    }

    if (viewSize.Y > areaZoom.Size.Y) {
      this.cameraCurrent.Y = (areaZoom.Size.Y - viewSize.Y) / 2;
    } else {
      const shiftY = Level.cameraShift.Y;
      const newCameraY = zoom * char.Position.Y - viewSize.Y * shiftY;
      const maxPosY = areaZoom.Size.Y - viewSize.Y;
      this.cameraCurrent.Y = Math.min(Math.max(newCameraY, areaZoom.Y), maxPosY);
    }

    if (this.lastZoom !== zoom || this.lastViewSize !== viewSize) {
      this.cameraCurrent.X = this.cameraTarget.X;
      this.lastZoom = zoom;
      this.lastViewSize = viewSize;
    } else if (this.cameraCurrent.X !== this.cameraTarget.X) {
      const cameraSpeed = Level.cameraSpeed * zoom;
      const cameraShift = elapsedSeconds * cameraSpeed;
      this.cameraCurrent.X = (this.cameraCurrent.X > this.cameraTarget.X)
        ? Math.max(this.cameraCurrent.X - cameraShift, this.cameraTarget.X)
        : Math.min(this.cameraCurrent.X + cameraShift, this.cameraTarget.X);
    }
  }

  public frame(elapsedSeconds:number, viewSize:Point, zoom:number):Load | undefined {
    const char = this.char as Character;
    const exit = this.processCollisions(char, elapsedSeconds, true);
    if (exit) return exit;
    this.entities?.forEach((entity) => this.processCollisions(entity, elapsedSeconds));
    this.processCamera(char, viewSize, zoom, elapsedSeconds);
    return undefined;
  }

  private static drawLine(c:RenderContext, zoom:number, camPos:Point, line:Line):void {
    const from = line.A.multiply(zoom).minus(camPos);
    const to = line.B.multiply(zoom).minus(camPos);
    c.moveTo(Math.round(from.X), Math.round(from.Y));
    c.lineTo(Math.round(to.X), Math.round(to.Y));
  }

  private static drawLines(c:RenderContext, zoom:number, p:Point, arr:Position[], clr:string):void {
    if (!arr.length) return;
    const cLocal = c;
    c.beginPath();
    cLocal.strokeStyle = clr;
    arr.forEach((pos) => Level.drawLine(c, zoom, p, pos.position));
    c.stroke();
    c.closePath();
  }

  private static readonly colors:Record<SurfaceType, string> = {
    [SurfaceType.Normal]: 'black',
    [SurfaceType.Ice]: 'aqua',
  };

  private readonly surfaceFilterCache = new Map();
  private static readonly surfaceTypesKeys = Object.keys(SurfaceType)
    .filter((v) => Number.isNaN(+v))
    .map((k) => SurfaceType[k as keyof typeof SurfaceType]);

  private surfaceFilter(group:SurfaceGroup, type:SurfaceType) {
    const key = JSON.stringify([group, type]);
    return (this.surfaceFilterCache.has(key)
      ? this.surfaceFilterCache
      : this.surfaceFilterCache.set(
        key,
        this.surfaces[group].filter((s) => s.type === type),
      )
    ).get(key);
  }

  private drawSurfaces(c:RenderContext, zoom:number, camPos:Point) {
    Level.surfaceTypesKeys.forEach((type) => {
      const color = Level.colors[type];
      c.setLineDash([9, 3]);
      Level.drawLines(c, zoom, camPos, this.surfaceFilter(SurfaceGroup.Platforms, type), color);
      c.setLineDash([]);
      Level.drawLines(c, zoom, camPos, this.surfaceFilter(SurfaceGroup.Walls, type), color);
      Level.drawLines(c, zoom, camPos, this.surfaceFilter(SurfaceGroup.Ceils, type), color);
    });
  }

  public draw(c:RenderContext, zoom:number, dBoxes = false, dSurfaces = false):void {
    const camPos = this.cameraCurrent;

    if (dSurfaces) {
      // because canvas is weird, need for sharp lines
      c.translate(0.5, 0.5);
      this.drawSurfaces(c, zoom, camPos);
      Level.drawLines(c, zoom, camPos, this.loadEnter, 'white');
      Level.drawLines(c, zoom, camPos, this.loadExit, 'yellow');
      c.translate(-0.5, -0.5);
    }

    this.char?.draw(c, camPos, zoom, dBoxes);
    this.entities?.forEach((entity) => entity.draw(c, camPos, zoom, dBoxes));
  }
}

export {
  Level, Load as LevelLoad, LevelId,
};
