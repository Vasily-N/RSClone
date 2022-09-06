import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(48, -100);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([new P(128, 160), new P(128, 160)])
    .map((v) => ({ ...v, levelId: LevelId.Beggining })),
  ...positionsFromPoints([
    loop, new P(48, 160), new P(416, 160), new P(480, 128), new P(512, 128),
    new P(512, 64), new P(464, 64), new P(432, 32), new P(432, loop.Y), loop,
  ]).map((s, i) => {
    if (i === 4) return { ...s, levelId: LevelId.S2, zone: 1 };
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
