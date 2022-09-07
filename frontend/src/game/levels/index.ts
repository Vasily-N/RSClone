import { Point, Line, Rectangle } from '../shapes';

import { LevelLoad as Load, Surface, Position } from './types';
import {
  LevelConfig, LoadingConfig as LoadZone, EntityConfig, SurfaceConfig, MusicConfig,
} from './config';

import { Entity, EntityClass } from '../entity';
import entitiesList from '../entity/list';

import SurfaceType from '../types';

import Character from '../character';
import { Camera, Collision } from './helpers';
import GameSoundPlay from '../soundPlay';
import { SpriteAnimation } from '../spriteAnimation';

enum SurfaceGroup { All, Walls, Floors, Ceils, Platforms } // Floors = Ceils + Platforms
type Surfaces = Record<SurfaceGroup, Surface[]>;

type RenderContext = CanvasRenderingContext2D;

class Level {
  private readonly surfaces:Surfaces;
  private readonly loadEnter:LoadZone[];
  private readonly loadExit:LoadZone[];
  private readonly entitiesConfig:EntityConfig[];
  private readonly music?:MusicConfig;
  private bgs?:SpriteAnimation[]; // todo: parallax
  private entities:Entity[] = [];
  private char?:Character;
  private camera:Camera;
  private elapsedSeconds = 0;

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

  private static readonly perpLen = 20;
  private static getPerpOfLine(l:Line):Line[] {
    const len = Level.perpLen / Math.hypot(l.Direction.X, l.Direction.Y);
    const perpDir = new Point(l.Direction.Y, l.Direction.X)
      .multiply(len).minus(new Point(len / 2, len / 2));
    return [
      new Line(l.A.minus(perpDir), l.A.plus(perpDir)),
      new Line(l.B.minus(perpDir), l.B.plus(perpDir)),
    ];
  }

  private static readonly wallAngle = (0 * Math.PI) / 180; // no not straight walls physics
  private static initSurfaces(surfaces:SurfaceConfig[], load:LoadZone[])
    :Record<SurfaceGroup, Surface[]> {
    const allLoadHack:SurfaceConfig[] = load
      .reduce((p:Line[], c) => p.concat(Level.getPerpOfLine(c.position)), [])
      .map((v) => ({ position: v }));
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

  private static initArea(surface:Surface[], minSize?:Point):Rectangle {
    const left = 0;
    const right = surface.reduce((p, c) => Math.max(p, c.position.MaxX), 0);
    const width = Math.max(right - left, minSize?.X || 0);
    const top = 0;
    const bottom = surface.reduce((p, c) => Math.max(p, c.position.MaxY), 0);
    const height = Math.max(bottom - top, minSize?.Y || 0);
    return new Rectangle(left, top, width, height);
  }

  private static splitConfig(walls:(SurfaceConfig | LoadZone)[]):[SurfaceConfig[], LoadZone[]] {
    return walls.reduce<[SurfaceConfig[], LoadZone[]]>((p:[SurfaceConfig[], LoadZone[]], c) => {
      let ret:[SurfaceConfig[], LoadZone[]];
      ret = ((c as LoadZone).levelId !== undefined)
        ? [p[0], [...p[1], c as LoadZone]]
        : ret = [[...p[0], c as SurfaceConfig], p[1]];
      return ret;
    }, [[], []] as [SurfaceConfig[], LoadZone[]]);
  }

  constructor(config:LevelConfig) {
    const [surfaces, loading] = Level.splitConfig(config.walls);
    this.surfaces = Level.initSurfaces(surfaces, loading);
    this.camera = new Camera(Level.initArea(this.surfaces[SurfaceGroup.All], config.minSize));

    this.entitiesConfig = config.entities;
    this.loadEnter = loading;
    this.loadExit = loading.filter((v) => v.zone !== undefined);
    if (config.music) this.music = config.music;
    if (config.backgrounds) this.bgs = config.backgrounds.map((b) => new SpriteAnimation(b));
  }

  public load(char:Character, zone = 0, positionPercentage = 0, portal = false):void {
    if (!portal) this.entities = Level.initEntities(this.entitiesConfig);
    this.char = char;
    const loadPos:Line = this.loadEnter[
      zone < this.loadEnter.length ? zone : Math.floor(Math.random() * this.loadEnter.length)
    ].position;
    this.camera.resetPosition();
    const pos = loadPos.MinX === loadPos.MaxX
      ? new Point(loadPos.MinX, loadPos.MaxY)
      : loadPos.B.minus(loadPos.A).multiply(positionPercentage).plus(loadPos.A);
    this.char.levelLoad(pos.minus(new Point(0, 0.1)));
    this.char.frame(0.0001);
    // hack to not stuck at loading screen and not to process "just loaded" every frame
    if (this.music) GameSoundPlay.music(this.music.url, this.music.loop);
    this.elapsedSeconds = 0;
  }

  private inAirTime = 0; // todo: re-code collision
  private processCollisions(e:Entity, elapsedSeconds:number, char = false):Load | null {
    const posBefore = new Point(e.Position.X, e.Position.Y); // to copy values and not the reference
    const ignoreFloor = e.frame(elapsedSeconds);
    const move = new Line(posBefore, e.Position);
    if (char) {
      const exit = Collision.processExitZones(this.loadExit, move);
      if (exit) return exit;
    }

    const ceilCollision = Collision.processCeil(this.surfaces[SurfaceGroup.Ceils], e, move);
    if (ceilCollision && ceilCollision.point.Y) {
      e.Position.Y = ceilCollision.point.Y + e.Collision.Height; e.resetVelocityY(true);
    }

    const floorCollision = !ignoreFloor
    && Collision.processFloor(e, this.surfaces[SurfaceGroup.Floors], move);
    if (floorCollision) {
      this.inAirTime = 0;
      e.Position.Y = floorCollision.point.Y;
    } else this.inAirTime += elapsedSeconds;

    const wallsCollision = Collision.processWalls(this.surfaces[SurfaceGroup.Walls], e, move)
      || (!floorCollision && !ceilCollision
        && Collision.processCeil2(this.surfaces[SurfaceGroup.Ceils], e, move));
    if (wallsCollision) {
      if (e.Position.Y !== wallsCollision.point.Y) {
        e.Position.Y = wallsCollision.point.Y; e.resetVelocityY();
      }
      if ((this.inAirTime === 0 || this.inAirTime > 0.05)
        // a temporal hack for wall collision when jump on stairs with high fps
        && e.Position.X !== wallsCollision.point.X) {
        e.Position.X = wallsCollision.point.X; e.resetVelocityX();
      }
    }
    e.Surface = (floorCollision && floorCollision?.surface)
              || (wallsCollision && wallsCollision.surface)
              || null;
    return null;
  }

  public frame(elapsedSeconds:number, viewSize:Point, zoom:number):Load | undefined {
    const char = this.char as Character;
    const exit = this.processCollisions(char, elapsedSeconds, true);
    if (exit) return exit;
    this.entities?.forEach((entity) => this.processCollisions(entity, elapsedSeconds));
    this.camera.process(char, viewSize, zoom, elapsedSeconds);
    this.elapsedSeconds += elapsedSeconds;
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
    [SurfaceType.Normal]: '#2F4F4F',
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
      c.setLineDash([15, 5]);
      Level.drawLines(c, zoom, camPos, this.surfaceFilter(SurfaceGroup.Platforms, type), color);
      c.setLineDash([]);
      Level.drawLines(c, zoom, camPos, this.surfaceFilter(SurfaceGroup.Walls, type), color);
      Level.drawLines(c, zoom, camPos, this.surfaceFilter(SurfaceGroup.Ceils, type), color);
    });
  }

  private drawBgs(c:RenderContext, zoom:number) {
    if (!this.bgs) return;
    const elapsed = this.elapsedSeconds;
    const pos = Point.Zero.minus(this.camera.Current);
    this.bgs.forEach((bg) => bg.drawFrame(c, pos, zoom, elapsed, false, 1));
  }

  public draw(c:RenderContext, zoom:number, dBoxes = false, dSurfaces = false):void {
    const camPos = this.camera.Current;

    const [translateX, translateY] = [0.5, 0.5];
    c.translate(translateX, translateY);
    this.drawBgs(c, zoom); // some bg drawn ugly without translate, and some with :(
    if (dSurfaces) {
      // line are always ugly without translate
      this.drawSurfaces(c, zoom, camPos);
      Level.drawLines(c, zoom, camPos, this.loadEnter, 'white');
      Level.drawLines(c, zoom, camPos, this.loadExit, 'yellow');
    }
    c.translate(-translateX, -translateY);
    this.char?.draw(c, camPos, zoom, dBoxes);
    this.entities?.forEach((entity) => entity.draw(c, camPos, zoom, dBoxes));
  }
}

export { Level, Load as LevelLoad };
