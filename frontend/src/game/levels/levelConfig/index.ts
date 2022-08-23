import { Point } from '../../shapes';
import EntityConfig from './entityConfig';
import LoadingConfig from './loadingConfig';
import { SurfaceConfig, surfaceLinesFromPoints } from './surfaceConfig';

type LevelConfig = {
  minSize:Point
  surfaces:SurfaceConfig[]
  entities:EntityConfig[]
  loading:LoadingConfig[]
};

export {
  LevelConfig, SurfaceConfig, EntityConfig, LoadingConfig, surfaceLinesFromPoints,
};
