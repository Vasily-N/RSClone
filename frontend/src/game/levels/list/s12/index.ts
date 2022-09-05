import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    new P(32, 32), new P(32, 176), new P(192, 176), new P(224, 144), new P(224, 128),
    new P(256, 128), new P(256, 64),
    new P(224, 64), new P(224, 32), new P(32, 32),
  ])
    .map((s, i) => {
      if (i === 5) return { ...s, levelId: LevelId.S11, zone: 1 };

      return s;
    }),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 256 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.ReincarnatedSouls];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 192),
};

export default cfg;
