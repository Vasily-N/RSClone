import { Point } from '../../shapes';
import { LevelConfig } from '../levelConfig';
import LevelId from './levelIds';

import testLevel from './testLevel';
import testLevel2 from './testLevel2';

const win = {
  minSize: Point.Zero, walls: [], entities: [],
};

const levelList:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
  [LevelId.test2]: testLevel2,
  [LevelId.winTheGame]: win,
};

export { levelList, LevelId };
