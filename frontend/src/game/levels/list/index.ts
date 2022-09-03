import { Point } from '../../shapes';
import { LevelConfig } from '../config';
import LevelId from './ids';

import testLevel from './testLevel';
import testLevel2 from './testLevel2';
import beggining from './beggining';

const win = {
  minSize: Point.Zero, walls: [], entities: [],
};

const levelList:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
  [LevelId.test2]: testLevel2,
  [LevelId.winTheGame]: win,
  [LevelId.beggining]: beggining,
  [LevelId.s1]: beggining,
  [LevelId.s2]: win,
  [LevelId.s3]: win,
};

export { levelList, LevelId };
