import { Point } from '../../shapes';
import { LevelConfig } from '../config';
import LevelId from './ids';

import testLevel from './testLevel';
import testLevel2 from './testLevel2';
import beggining from './beggining';
import s1 from './s1';
import s2 from './s2';
import s3 from './s3';
import s4 from './s4';
import s5 from './s5';
import s6 from './s6';
import s7 from './s7';
import s8 from './s8';
import s9 from './s9';
import s10 from './s10';
import s11 from './s11';
import s12 from './s12';
import s13 from './s13';
import s14 from './s14';
import s15 from './s15';
import s16 from './s16';
import s17 from './s17';

const win = {
  minSize: Point.Zero, walls: [], entities: [],
};

const levelList:Record<LevelId, LevelConfig> = {
  [LevelId.test]: testLevel,
  [LevelId.test2]: testLevel2,
  [LevelId.WinTheGame]: win,
  [LevelId.Beggining]: beggining,
  [LevelId.S1]: s1,
  [LevelId.S2]: s2,
  [LevelId.S3]: s3,
  [LevelId.S4]: s4,
  [LevelId.S5]: s5,
  [LevelId.S6]: s6,
  [LevelId.S7]: s7,
  [LevelId.S8]: s8,
  [LevelId.S9]: s9,
  [LevelId.S10]: s10,
  [LevelId.S11]: s11,
  [LevelId.S12]: s12,
  [LevelId.S13]: s13,
  [LevelId.S14]: s14,
  [LevelId.S15]: s15,
  [LevelId.S16]: s16,
  [LevelId.S17]: s17,
};

export { levelList, LevelId };
