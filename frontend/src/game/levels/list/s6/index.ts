import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const loop = new P(0, 256);

const addUnderwater = false;
const underwater = positionsFromPoints([
  loop, new P(0, 320),

  new P(96, 480), new P(160, 480), new P(160, 512), new P(96, 512),
  new P(96, 608), new P(128, 608), new P(128, 640), new P(16, 640), new P(16, 704),

  new P(96, 704), new P(160, 736), new P(320, 736), new P(384, 704),
]);

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    loop, new P(0, 320),
    new P(32, 320), new P(96, 352), new P(256, 352),

    new P(384, 352), new P(448, 320), new P(512, 320), new P(512, 256), new P(416, 256),
    new P(416, 256), new P(416, 208), new P(400, 192), new P(384, 192), new P(384, 144),

    new P(144, 144),
    new P(144, 128), new P(448, 128), new P(448, 64), new P(416, 64), new P(400, 48),
    new P(384, 48), new P(384, 16), new P(32, 16), new P(32, 64), new P(64, 64),
    new P(64, 96), new P(32, 96),
    new P(32, 224), new P(64, 224), new P(64, 256), loop,
  ])
    .map((s, i) => {
      if (i === 0) return { ...s, levelId: LevelId.S5, zone: 1 };
      if (i === 7) return { ...s, levelId: LevelId.S16, zone: 0 };
      return s;
    }),
].concat(addUnderwater ? underwater : []);

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 512 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.DraculasCastle];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 768),
};

export default cfg;
