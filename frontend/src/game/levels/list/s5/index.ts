import { Point as P } from '../../../shapes';
import bg from './index.png';
import { MusicId, musicList } from '../../music';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([
    new P(48, 0), new P(48, 256),
    new P(0, 256), new P(0, 320),
    new P(32, 320), new P(96, 352), new P(928, 352), new P(992, 320),
    new P(1024, 320), new P(1024, 256),
    new P(960, 256), new P(960, 224), new P(992, 224), new P(992, 0),
  ]).map((s, i) => {
    if (i === 2) return { ...s, levelId: LevelId.S4, zone: 3 };
    if (i === 8) return { ...s, levelId: LevelId.S6, zone: 0 };
    return s;
  }),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 1024 };
const backgrounds = [bgconfig];
const music = musicList[MusicId.DraculasCastle];

const cfg:LevelConfig = {
  walls, entities, backgrounds, music, minSize: new P(bgconfig.frameSize, 384),
};

export default cfg;
