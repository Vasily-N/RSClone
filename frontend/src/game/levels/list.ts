import testLevel from './testLevel';
import { LevelConfig, LevelId } from './types';

const levelList:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
};

export default levelList;
