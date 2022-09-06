import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(80, -100);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop, new P(80, 64),
    new P(0, 64), new P(0, 128),
    new P(32, 128), new P(64, 160),
    new P(80, 160), new P(144, 176), new P(336, 176),
    new P(400, 160), new P(416, 160), new P(480, 128),
    new P(512, 128), new P(512, 64),
    new P(480, 64), new P(448, 32), new P(448, loop.Y), loop,
  ]).map((s, i) => {
    if (i === 2) return { ...s, levelId: LevelId.S9, zone: 1 };
    if (i === 12) return { ...s, levelId: LevelId.S4, zone: 1 };
    return s;
  }),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 512 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.DraculasCastle];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 192),
};

export default cfg;
