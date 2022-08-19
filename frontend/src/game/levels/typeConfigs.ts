import Line from '../helperTypes/line';
import SurfaceType from './typeSurface';
import EntityType from '../entity/typeEntityIds';
import Point from '../helperTypes/point';
import LevelId from './typeLevelIds';

type SurfaceConfig = {
  type?:SurfaceType
  platform?:boolean
  position:Line
};

const surfaceListHelper = (points:Point[]):SurfaceConfig[] => points
  .reduce((res:Line[], p:Point) => res.concat(new Line(res.at(-1)?.B || new Point(0, 0), p)), [])
  .slice(1)
  .map((position:Line) => ({ position }));

type EntityConfig = {
  type:EntityType
  position:Point
};

type LoadingConfig = {
  position:Line
  levelId:LevelId
  zone?:number
};

type LevelConfig = {
  size:Point
  surfaces:SurfaceConfig[]
  entities:EntityConfig[]
  loading:LoadingConfig[]
};

export {
  SurfaceConfig, EntityConfig, LoadingConfig, LevelConfig, surfaceListHelper,
};
