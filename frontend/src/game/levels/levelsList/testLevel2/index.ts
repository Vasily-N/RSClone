import { Point as P } from '../../../shapes';
import SurfaceType from '../../../types';
import music from "./Dracula's Castle.mp3";

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints,
} from '../../levelConfig';
import LevelId from '../levelIds';

const walls:(SurfaceConfig | LoadingConfig)[] = [
  ...positionsFromPoints([new P(150, 199), new P(150, 200)])
    .map((v) => ({ ...v, levelId: LevelId.test2 })),
  ...positionsFromPoints([
    P.Zero, new P(0, 100), new P(0, 200),
    new P(200, 200), new P(200, 400), new P(0, 500),
    new P(0, 600), new P(200, 500),
    new P(400, 500), new P(600, 600),
    new P(600, 500), new P(400, 400), new P(400, 200), new P(600, 200),
    new P(600, 100), new P(600, 0), new P(350, 0), new P(250, 0), P.Zero,
  ]).map((v, i) => {
    if (i === 7) return { ...v, type: SurfaceType.Ice };
    if (i === 1) return { ...v, levelId: LevelId.test2, zone: 3 };
    if (i === 5) return { ...v, levelId: LevelId.test, zone: 1 };
    if (i === 9) return { ...v, levelId: LevelId.test, zone: 0 };
    if (i === 13) return { ...v, levelId: LevelId.test2, zone: 1 };
    if (i === 16) return { ...v, levelId: LevelId.winTheGame, zone: -1 };
    return v;
  }),

  ...positionsFromPoints([new P(200, 400), new P(250, 400)]),
  ...positionsFromPoints([new P(350, 400), new P(400, 400)]),

  ...positionsFromPoints([new P(250, 300), new P(350, 300)]),
  ...positionsFromPoints([new P(200, 200), new P(250, 200)]),
  ...positionsFromPoints([new P(350, 200), new P(400, 200)]),

  ...positionsFromPoints([new P(250, 100), new P(350, 100)]),
];

const entities:EntityConfig[] = [

];

const cfg:LevelConfig = { walls, entities, music };

export default cfg;
