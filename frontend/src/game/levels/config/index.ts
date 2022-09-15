import { Point } from '../../shapes';
import EntityConfig from './entityConfig';
import LoadingConfig from './loadingConfig';
import SurfaceConfig from './surfaceConfig';
import positionsFromPoints from './positionsFromPoints';
import { SpriteConfig } from '../../spriteAnimation';
import { MusicConfig } from '../music';

type LevelConfig = {
  minSize?:Point
  walls:(SurfaceConfig | LoadingConfig)[]
  entities:EntityConfig[]
  music?:MusicConfig
  backgrounds?:SpriteConfig[]
};

export {
  LevelConfig, SurfaceConfig, EntityConfig, LoadingConfig, positionsFromPoints,
  SpriteConfig, MusicConfig,
};
