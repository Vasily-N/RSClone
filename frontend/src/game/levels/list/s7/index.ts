import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(32, 32);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop, new P(32, 64),
    new P(0, 64), new P(0, 128),
    new P(32, 128), new P(32, 144), new P(64, 176),
    new P(224, 176), new P(224, 32),
    loop,
  ]).map((s, i) => ((i === 2) ? { ...s, levelId: LevelId.S4, zone: 2 } : s)),
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
