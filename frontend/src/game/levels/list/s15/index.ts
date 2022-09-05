import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(0, 64);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop, new P(0, 128),
    new P(32, 128), new P(32, 160), new P(448, 160), new P(448, 128), new P(544, 128),
    new P(544, 160), new P(672, 160), new P(672, 128), new P(768, 128), new P(768, 64),
    new P(672, 64), new P(672, 32), new P(544, 32),
    new P(544, 64), new P(448, 64), new P(448, 32), new P(32, 32), new P(32, 64), loop,
  ]).map((s, i) => {
    if (i === 0) return { ...s, levelId: LevelId.S14, zone: 1 };
    if (i === 10) return { ...s, levelId: LevelId.S6, zone: 1 };
    return s;
  }),
  ...positionsFromPoints([new P(736, 128), new P(736, 64)]),
  ...positionsFromPoints([new P(672, 128), new P(672, 64)])
    .map((s) => ({ ...s, levelId: LevelId.WinTheGame, zone: -1 })),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 768 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.PitchBlackIntrussion];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 192),
};

export default cfg;
