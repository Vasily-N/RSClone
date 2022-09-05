import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop1 = new P(32, 16);
const loop2 = new P(0, 256);
const loop3 = new P(0, 640);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop1, new P(32, 64),
    new P(0, 64), new P(0, 128),
    new P(64, 128), new P(64, 96), new P(96, 96), new P(96, 176),
    new P(192, 176), new P(192, 144), new P(224, 144), new P(224, 128),
    new P(256, 128), new P(256, 64),
    new P(224, 64), new P(224, 16), loop1,
  ]).map((s, i) => {
    if (i === 2) return { ...s, levelId: LevelId.S10, zone: 5 };
    if (i === 12) return { ...s, levelId: LevelId.S8, zone: 0 };
    return s;
  }),
  ...positionsFromPoints([
    loop2, new P(0, 320),
    new P(208, 320), new P(208, 352), new P(192, 352), new P(192, 336), new P(64, 336),
    new P(64, 352), new P(48, 352), new P(48, 336), new P(16, 336), new P(16, 512),
    new P(48, 512), new P(80, 544), new P(192, 544), new P(224, 512),
    new P(256, 512), new P(256, 448),
    new P(48, 448), new P(48, 432), new P(240, 432), new P(240, 224), new P(208, 224),
    new P(208, 240), new P(192, 240), new P(192, 224), new P(32, 224), new P(32, 256),
    loop2,
  ]).map((s, i) => {
    if (i === 0) return { ...s, levelId: LevelId.S10, zone: 4 };
    if (i === 16) return { ...s, levelId: LevelId.S13, zone: 1 };
    return s;
  }),
  ...positionsFromPoints([
    loop3,
    new P(0, 704), new P(32, 704), new P(64, 736), new P(160, 736),
    new P(160, 608), new P(64, 608), new P(32, 640),
    loop3,
  ]).map((s, i) => ((i === 0) ? { ...s, levelId: LevelId.S10, zone: 3 } : s)),

  ...positionsFromPoints([new P(208, 368), new P(240, 368)], true),
  ...positionsFromPoints([new P(16, 464), new P(48, 464)], true),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 256 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.PitchBlackIntrussion];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 768),
};

export default cfg;
