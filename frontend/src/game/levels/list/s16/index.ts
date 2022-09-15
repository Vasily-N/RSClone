import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(0, 256);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop, new P(0, 320),
    new P(32, 320), new P(96, 352), new P(416, 352), new P(480, 320), new P(496, 320),
    new P(496, 256), new P(448, 256), new P(448, 208), new P(432, 192), new P(416, 192),
    new P(416, 176), new P(400, 176), new P(400, 112), new P(112, 112), new P(112, 176),
    new P(96, 176), new P(96, 192), new P(80, 192), new P(64, 208), new P(64, 256),
    loop,
  ])
    .map((s, i) => {
      if (i === 0) return { ...s, levelId: LevelId.S6, zone: 1 };
      return s;
    }),
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
