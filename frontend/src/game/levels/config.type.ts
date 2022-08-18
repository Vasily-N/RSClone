import Line from '../types/Line';
import SurfaceType from './surfaceType';
import EntityType from '../entity/entityIds';
import Point from '../types/Point';
import LevelId from './levelIds';

type Surface = {
  type?:SurfaceType
  platform?:boolean
  position:Line
};

type Entity = {
  type:EntityType
  position:Point
};

type Loading = {
  position:Line
  levelId:LevelId
  zone:number
};

type LevelConfig = {
  surfaces:Surface[]
  entities:Entity[]
  loading:Loading[]
};

export {
  Surface, Entity, Loading, LevelConfig,
};
