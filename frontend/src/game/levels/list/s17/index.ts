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
    new P(32, 128), new P(64, 160),
    new P(224, 160), new P(224, 128), new P(256, 128), new P(256, 32),
    new P(64, 32), new P(32, 64), loop,
  ]).map((s, i) => ((i === 0) ? { ...s, levelId: LevelId.S14, zone: 3 } : s)),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 272 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.PitchBlackIntrussion];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 192),
};

export default cfg;
