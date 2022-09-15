import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';
import SurfaceType from '../../../types';

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    new P(432, 128),
    new P(512, 128), new P(512, 64),
    new P(432, 64), new P(432, -100), new P(48, -100), new P(48, 256), new P(0, 256),
    new P(0, 320), new P(64, 320),
  ]).map((s, i) => {
    if (i === 1) return { ...s, levelId: LevelId.S14, zone: 0 };
    if (i === 7) return { ...s, levelId: LevelId.S9, zone: 3 };
    return s;
  }),

  ...positionsFromPoints([
    new P(64, 320), new P(64, 432), new P(48, 432), new P(48, 512), new P(272, 512),
    new P(272, 544), new P(432, 544), new P(464, 512),
    new P(512, 512), new P(512, 448),
    new P(416, 448), new P(416, 320),
  ]).map((s, i) => {
    if (i === 8) return { ...s, levelId: LevelId.S14, zone: 2 };
    if (i === 5) return { ...s, type: SurfaceType.Ice };
    if (i === 3) return { ...s, type: SurfaceType.Ice };
    return s;
  }),

  ...positionsFromPoints([
    new P(416, 320), new P(432, 320), new P(432, 240), new P(416, 240),
    new P(416, 192), new P(432, 176), new P(432, 144),
  ]),

  ...positionsFromPoints([new P(192, 400), new P(224, 400)], true),
  ...positionsFromPoints([new P(240, 352), new P(288, 352), new P(416, 320)], true),
  ...positionsFromPoints([new P(224, 144), new P(288, 128), new P(432, 128)], true),
  ...positionsFromPoints([new P(64, 320), new P(176, 320)], true),
  ...positionsFromPoints([new P(48, 272), new P(80, 272)], true),
  ...positionsFromPoints([new P(48, 240), new P(80, 240)], true),
  ...positionsFromPoints([new P(48, 208), new P(80, 208)], true),
  ...positionsFromPoints([new P(48, 176), new P(80, 176)], true),
  ...positionsFromPoints([new P(48, 144), new P(80, 144)], true),

  ...positionsFromPoints(
    [new P(170, 478), new P(180, 476), new P(188, 464), new P(256, 464), new P(260, 466)],
    true,
  ),

  ...positionsFromPoints([new P(336, 500), new P(368, 500)], true),
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
