import Line from '../helperTypes/line';
import SurfaceType from './typeSurface';
import EntityType from '../entity/typeEntityIds';
import Point from '../helperTypes/point';
import LevelId from './typeLevelIds';

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
