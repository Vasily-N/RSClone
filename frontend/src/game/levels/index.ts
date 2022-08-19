import {
  LevelConfig, LoadingConfig, SurfaceConfig, EntityConfig,
} from './typeConfigs';
import SurfaceType from './typeSurface';

import Point from '../helperTypes/point';
import Entity from '../entity';

import entitiesList from '../entity/list';
import EntityClass from '../entity/typeClass';
import Character from '../character';
import Line from '../helperTypes/line';

class Level {
  private readonly surfaces:SurfaceConfig[];
  private readonly entitiesConfig:EntityConfig[];
  private entities?:Entity[];
  private char?:Character;
  private readonly loadEnter:LoadingConfig[];
  private readonly loadExit:LoadingConfig[];

  private static newEntity<A extends Entity>(EntityConstructor:EntityClass<A>, position:Point):A {
    return new EntityConstructor(position);
  }

  private static initEntities(entitiesConfig:EntityConfig[]) {
    return entitiesConfig.map((v) => Level.newEntity(entitiesList[v.type], v.position));
  }

  constructor(config:LevelConfig) {
    this.surfaces = config.surfaces.map((v) => ({ ...v, type: SurfaceType.Normal }));
    this.entitiesConfig = config.entities;
    this.loadEnter = config.loading;
    this.loadExit = config.loading.filter((v) => v.zone !== undefined);
  }

  public load(char:Character, zone = 0, positionPercentage = 0) {
    this.entities = Level.initEntities(this.entitiesConfig);
    this.char = char;
    const loadPos:Line = this.loadEnter[
      zone < this.loadEnter.length ? zone : Math.floor(Math.random() * this.loadEnter.length)
    ].position;
    const position:Point = loadPos.B.minus(loadPos.A).multiply(positionPercentage).plus(loadPos.A);
    this.char.Position = position;
  }

  public frame(elapsedSeconds:number) {
    // todo: process surfaces and hitboxes
    this.char?.frame(elapsedSeconds);
    this.entities?.forEach((entity) => entity.frame(elapsedSeconds));
  }
}

export default Level;
