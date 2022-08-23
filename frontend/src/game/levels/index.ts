import { Point, Line, Rectangle } from '../shapes';

import {
  LevelLoad as Load, LevelId, Surface, Position,
} from './types';
import {
  LevelConfig, LoadingConfig as LoadZone, EntityConfig, SurfaceConfig,
} from './levelConfig';

import { Entity, EntityClass } from '../entity';
import entitiesList from '../entity/list';

import SurfaceType from '../types';

import Character from '../character';
import { Camera, Collision } from './helpers';

enum SurfaceGroup { All, Walls, Floors, Ceils, Platforms } // Floors = Ceils + Platforms
type Surfaces = Record<SurfaceGroup, Surface[]>;

type RenderContext = CanvasRenderingContext2D;

class Level {
  private readonly surfaces:Surfaces;
  private readonly loadEnter:LoadZone[];
  private readonly loadExit:LoadZone[];
  private readonly entitiesConfig:EntityConfig[];
  private entities:Entity[] = [];
  private char?:Character;
  private camera:Camera;

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
    this.camera = new Camera(Level.initArea(this.surfaces[SurfaceGroup.All], config.minSize));

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
    this.camera.resetPosition();
    this.char.SurfaceType = null;
    const pos = loadPos.B.minus(loadPos.A).multiply(positionPercentage).plus(loadPos.A);
    this.char.Position.X = pos.X;
    this.char.Position.Y = pos.Y;
    this.char.frame(0.0001);
    // hack to not stuck at loading screen and not to process "just loaded" every frame
  }

  private processCollisions(e:Entity, elapsedSeconds:number, char = false):Load | null {
    const posBefore = new Point(e.Position.X, e.Position.Y); // to copy values and not the reference
    e.frame(elapsedSeconds);
    const move = new Line(posBefore, e.Position);
    if (char) {
      const exit = Collision.processExitZones(this.loadExit, move);
      if (exit) return exit;
    }

    const ceilCollision = Collision.processCeil(this.surfaces[SurfaceGroup.Ceils], e, move);
    if (ceilCollision) {
      e.Position.Y = ceilCollision.point.Y + e.Collision.Height;
      e.resetVelocityY(true);
    }

    const floorCollision = Collision.processFloor(e, this.surfaces[SurfaceGroup.Floors], move);
    if (floorCollision) {
      e.Position.Y = floorCollision.point.Y;
      if (floorCollision.surface) e.SurfaceType = floorCollision.surface.type;
    } else e.SurfaceType = null;

    const wallsCollision = Collision.processWalls(this.surfaces[SurfaceGroup.Walls], e, move)
      || (!floorCollision && !ceilCollision
        && Collision.processCeil2(this.surfaces[SurfaceGroup.Ceils], e, move));
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

  public frame(elapsedSeconds:number, viewSize:Point, zoom:number):Load | undefined {
    const char = this.char as Character;
    const exit = this.processCollisions(char, elapsedSeconds, true);
    if (exit) return exit;
    this.entities?.forEach((entity) => this.processCollisions(entity, elapsedSeconds));
    this.camera.process(char, viewSize, zoom, elapsedSeconds);
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

  private readonly surfaceFilterCache = new Map<string, Surface[]>();
  private static readonly surfaceTypesKeys = Object.keys(SurfaceType)
    .filter((v) => Number.isNaN(+v))
    .map((k) => SurfaceType[k as keyof typeof SurfaceType]);

  private surfaceFilter(group:SurfaceGroup, type:SurfaceType):Surface[] {
    const key = JSON.stringify([group, type]);
    return (this.surfaceFilterCache.has(key)
      ? this.surfaceFilterCache
      : this.surfaceFilterCache.set(
        key,
        this.surfaces[group].filter((s) => s.type === type),
      )
    ).get(key) as Surface[];
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
    const camPos = this.camera.Current;

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
