import {
  LevelConfig, Loading, Surface, Entity as EntityConfig,
} from './config.type';
import SurfaceType from './surfaceType';

import Point from '../types/Point';
import Entity from '../entity';

import entitiesList from '../entity/list';
import EntityClass from '../entity/classType';

class Level {
  private readonly surfaces:Surface[];
  private readonly entitiesConfig:EntityConfig[];
  private entities?:Entity[];
  private readonly loading:Loading[];

  private static newEntity<A extends Entity>(EntityConstructor:EntityClass<A>, position:Point):A {
    return new EntityConstructor(position);
  }

  private static initEntities(entitiesConfig:EntityConfig[]) {
    return entitiesConfig.map((v) => Level.newEntity(entitiesList[v.type], v.position));
  }

  constructor(config:LevelConfig) {
    this.surfaces = config.surfaces.map((v) => ({ type: SurfaceType.Normal, ...v }));
    console.log(this.surfaces, config.surfaces);
    this.entitiesConfig = config.entities;
    this.loading = config.loading;
  }

  public load() {
    this.entities = Level.initEntities(this.entitiesConfig);
  }
}

export default Level;
