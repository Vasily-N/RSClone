import testLevel from './testLevel';
import { LevelConfig } from '../levelConfig';
import LevelId from './levelIds';

const levelList:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
};

export { levelList, LevelId };
