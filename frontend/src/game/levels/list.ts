import testLevel from './testLevel';
import { LevelConfig } from './levelConfig';
import { LevelId } from './types';

const levelList:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
};

export default levelList;
