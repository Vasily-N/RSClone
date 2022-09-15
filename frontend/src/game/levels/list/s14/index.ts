import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop1 = new P(0, 64);
const loop2 = new P(0, 448);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop1, new P(0, 128),
    new P(208, 128), new P(208, 160), new P(192, 160), new P(192, 144), new P(64, 144),
    new P(64, 160), new P(48, 160), new P(48, 144), new P(16, 144), new P(16, 320),
    new P(48, 320), new P(80, 352), new P(208, 352), new P(240, 320), new P(272, 320),
    new P(272, 352), new P(496, 352), new P(496, 224), new P(320, 224), new P(320, 272),
    new P(304, 272), new P(304, 160), new P(448, 160), new P(480, 128),
    new P(512, 128), new P(512, 64),
    new P(480, 64), new P(448, 32), new P(320, 32), new P(320, 80), new P(304, 80),
    new P(304, 32), new P(272, 32), new P(272, 128), new P(256, 128), new P(256, 256),
    new P(48, 256), new P(48, 240), new P(240, 240), new P(240, 32), new P(208, 32),
    new P(208, 48), new P(192, 48), new P(192, 32), new P(32, 32), new P(32, 64),
    loop1,
  ])
    .map((s, i) => {
      if (i === 0) return { ...s, levelId: LevelId.S13, zone: 0 };
      if (i === 26) return { ...s, levelId: LevelId.S15, zone: 0 };
      return s;
    }),

  ...positionsFromPoints([
    loop2, new P(0, 512),
    new P(32, 512), new P(64, 544), new P(448, 544),
    new P(448, 544), new P(480, 512),
    new P(512, 512), new P(512, 448),
    new P(480, 448), new P(448, 416), new P(64, 416), new P(32, 448),
    loop2,
  ]).map((s, i) => {
    if (i === 0) return { ...s, levelId: LevelId.S13, zone: 2 };
    if (i === 7) return { ...s, levelId: LevelId.S17, zone: 1 };
    return s;
  }),
  ...positionsFromPoints([new P(272, 256), new P(304, 256)], true),
  ...positionsFromPoints([new P(272, 192), new P(304, 192)], true),
  ...positionsFromPoints([new P(208, 176), new P(240, 176)], true),
  ...positionsFromPoints([new P(16, 272), new P(48, 272)], true),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 512 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.PitchBlackIntrussion];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 576),
};

export default cfg;
