import { Point as P } from '../../../shapes';
import bg from './index.png';
import music from './Reincarnated Soul.mp3';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints, SpriteConfig,
} from '../../config';
import LevelId from '../ids';

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([new P(150, 160), new P(150, 160)])
    .map((v) => ({ ...v, levelId: LevelId.beggining })),
  ...positionsFromPoints([
    P.Zero, new P(48, 0), new P(48, 160), new P(416, 160), new P(480, 128), new P(512, 128),
    new P(512, 64), new P(464, 64), new P(432, 36), new P(432, 0),
  ]).map((s, i) => {
    if (i === 5) return { ...s, levelId: LevelId.s1, zone: 0 };
    return s;
  }),
];

const entities:EntityConfig[] = [

];

const bgconfig:SpriteConfig = { link: bg, frameSize: 512 };

const cfg:LevelConfig = {
  walls, entities, backgrounds: [bgconfig], music, musicLoop: 9.109,
};

export default cfg;
