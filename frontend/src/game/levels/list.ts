import { LevelConfig } from './typeConfigs';
import LevelId from './typeLevelIds';
import testLevel from './testLevel';

const levelList:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
};

export default levelList;
