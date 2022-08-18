import { LevelConfig } from './config.type';
import LevelId from './ids';
import testLevel from './testLevel';

const list:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
};

export { LevelId as Level, list };
