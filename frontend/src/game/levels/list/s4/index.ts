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
    loop, new P(48, 64),
    new P(0, 64), new P(0, 128),
    new P(32, 128), new P(96, 176), new P(32, 256),
    new P(0, 256), new P(0, 320),
    new P(32, 320), new P(64, 336), new P(192, 336), new P(224, 320),
    new P(256, 320), new P(256, 256),
    new P(224, 256), new P(160, 176), new P(224, 128),
    new P(256, 128), new P(256, 64),
    new P(208, 64), new P(208, 0), loop,
  ]).map((s, i) => {
    if (i === 2) return { ...s, levelId: LevelId.S3, zone: 1 };
    if (i === 7) return { ...s, levelId: LevelId.S8, zone: 1 };
    if (i === 13) return { ...s, levelId: LevelId.S7, zone: 0 };
    if (i === 18) return { ...s, levelId: LevelId.S5, zone: 0 };
    return s;
  }),
  ...positionsFromPoints([new P(128, 176), new P(160, 176)], true),
  ...positionsFromPoints([new P(128, 232), new P(160, 232)], true),
  ...positionsFromPoints([new P(128, 280), new P(160, 280)], true),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 256 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.DraculasCastle];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 384),
};

export default cfg;
