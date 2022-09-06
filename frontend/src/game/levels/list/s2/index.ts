import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(48, -100);
const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop, new P(48, 64),
    new P(0, 64), new P(0, 128),
    new P(48, 128), new P(48, 192), new P(80, 192), new P(80, 224), new P(48, 256),
    new P(0, 256), new P(0, 320),
    new P(48, 320), new P(80, 336), new P(368, 336), new P(432, 320),
    new P(512, 320), new P(512, 256),
    new P(464, 256), new P(432, 224), new P(432, 192), new P(464, 192), new P(464, loop.Y), loop,
  ]).map((s, i) => {
    if (i === 2) return { ...s, levelId: LevelId.S1, zone: 0 };
    if (i === 9) return { ...s, levelId: LevelId.Beggining, zone: 1 };
    if (i === 15) return { ...s, levelId: LevelId.S3, zone: 0 };
    return s;
  }),

  ...positionsFromPoints([new P(176, 144), new P(336, 144)], true),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 512 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.DraculasCastle];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 384),
};

export default cfg;
