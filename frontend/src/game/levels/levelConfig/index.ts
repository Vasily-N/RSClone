import { Point } from '../../shapes';
import EntityConfig from './entityConfig';
import LoadingConfig from './loadingConfig';
import SurfaceConfig from './surfaceConfig';
import positionsFromPoints from './positionsFromPoints';

type LevelConfig = {
  minSize?:Point
  walls:(SurfaceConfig | LoadingConfig)[]
  entities:EntityConfig[]
};

export {
  LevelConfig, SurfaceConfig, EntityConfig, LoadingConfig, positionsFromPoints,
};
