import { LevelConfig } from './config.type';
import LevelId from './levelIds';
import testLevel from './testLevel';

const list:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
};

export default list;
