import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop1 = new P(16, 32);
const loop2 = new P(80, 416);
const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop2, new P(80, 544), new P(192, 544), new P(224, 512),
    new P(256, 512), new P(256, 448),
    new P(224, 448), new P(192, 416),
    loop2,
  ]).map((s, i) => (i === 4 ? { ...s, levelId: LevelId.S10, zone: 2 } : s)),
  ...positionsFromPoints([
    loop1, new P(16, 256),
    new P(0, 256), new P(0, 320),
    new P(48, 320), new P(80, 352), new P(192, 352), new P(224, 320),
    new P(256, 320), new P(256, 256),
    new P(224, 256), new P(192, 224), new P(64, 224), new P(64, 256), new P(48, 256),
    new P(48, 224), new P(48, 160), new P(192, 160), new P(224, 128),
    new P(256, 128), new P(256, 64),
    new P(224, 64), new P(192, 32), new P(64, 32), new P(64, 64),
    new P(48, 64), new P(48, 32), loop1,
  ])
    .map((s, i) => {
      if (i === 2) return { ...s, levelId: LevelId.S12, zone: 0 };
      if (i === 8) return { ...s, levelId: LevelId.S10, zone: 1 };
      if (i === 19) return { ...s, levelId: LevelId.S10, zone: 0 };

      return s;
    }),
  ...positionsFromPoints([new P(16, 272), new P(48, 272)], true),
  ...positionsFromPoints([new P(16, 224), new P(48, 224)], true),
  ...positionsFromPoints([new P(16, 176), new P(48, 176)], true),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 256 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.PitchBlackIntrussion];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 576),
};

export default cfg;
