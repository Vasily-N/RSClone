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

class Level {
  private readonly surfaces:Surface[];
  private readonly loadEnter:LoadZone[];
  private readonly loadExit:LoadZone[];
  private readonly entitiesConfig:EntityConfig[];
  private entities?:Entity[];
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

  public frame(elapsedSeconds:number):void {
    // todo: process surfaces and hitboxes
    this.char?.frame(elapsedSeconds);
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
