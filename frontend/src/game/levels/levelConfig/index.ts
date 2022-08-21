import { Point } from '../../../shapes';
import EntityConfig from './entityConfig';
import LoadingConfig from './loadingConfig';
import { SurfaceConfig, surfaceConfigList } from './surfaceConfig';

type LevelConfig = {
  size:Point
  surfaces:SurfaceConfig[]
  entities:EntityConfig[]
  loading:LoadingConfig[]
};

export {
  LevelConfig, SurfaceConfig, EntityConfig, LoadingConfig, surfaceConfigList,
};
