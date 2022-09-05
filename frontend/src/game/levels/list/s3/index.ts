import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(48, 0);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop, new P(48, 16), new P(16, 48), new P(16, 48), new P(16, 112), new P(32, 112),
    new P(48, 112), new P(80, 144), new P(80, 160), new P(48, 192), new P(48, 576),
    new P(48, 576), new P(80, 576), new P(80, 608), new P(48, 640),
    new P(0, 640), new P(0, 704),
    new P(288, 704), new P(352, 720), new P(512, 720), new P(576, 704),
    new P(768, 704), new P(768, 640),
    new P(720, 640), new P(688, 608), new P(688, 576), new P(720, 576), new P(720, 192),
    new P(688, 160), new P(688, 128), new P(752, 128),
    new P(752, 64), new P(688, 64), new P(688, 0), loop,
  ]).map((s, i) => {
    if (i === 15) return { ...s, levelId: LevelId.S2, zone: 2 };
    if (i === 21) return { ...s, levelId: LevelId.S4, zone: 0 };
    return s;
  }),

  ...positionsFromPoints([new P(80, 144), new P(208, 176)], true),
  ...positionsFromPoints([new P(256, 240), new P(304, 240)], true),
  ...positionsFromPoints([new P(352, 176), new P(496, 176), new P(688, 128)], true),
  ...positionsFromPoints([new P(48, 280), new P(80, 288), new P(208, 288)], true),
  ...positionsFromPoints([new P(208, 304), new P(336, 304)], true),
  ...positionsFromPoints([new P(368, 416), new P(432, 416)], true),
  ...positionsFromPoints([new P(512, 320), new P(576, 304), new P(720, 304)], true),
  ...positionsFromPoints([new P(48, 448), new P(160, 448), new P(480, 528)], true),
  ...positionsFromPoints([new P(576, 608), new P(608, 608)], true),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 768 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.DraculasCastle];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 768),
};

export default cfg;
