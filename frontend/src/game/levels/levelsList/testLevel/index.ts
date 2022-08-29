import { Point as P, Rectangle } from '../../../shapes';
import SurfaceType from '../../../types';
import music from './Beggining.mp3';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, positionsFromPoints,
} from '../../levelConfig';
import LevelId from '../levelIds';

const entities:EntityConfig[] = [];

const surfaces:SurfaceConfig[] = [
  ...positionsFromPoints([
    P.Zero, new P(0, 400), new P(200, 400), new P(200, 500),
    new P(400, 500), new P(400, 400), new P(800, 400), new P(800, 0),
    P.Zero,
  ]),
  { position: new Rectangle(200, 300, 200, 0).DiagonalA, platform: true },
  { position: new Rectangle(150, 50, 150, 150).DiagonalA, platform: true },
  { position: new Rectangle(300, 200, 200, 0).DiagonalA, platform: true },
  ...positionsFromPoints([
    new P(780, 250), new P(750, 250), new P(650, 300), new P(600, 340),
    new P(560, 350),
  ]),
  ...positionsFromPoints([
    new P(550, 250), new P(560, 240),
  ]),
  ...positionsFromPoints([new P(200, 400), new P(210, 400), new P(210, 500)]),
  ...positionsFromPoints([new P(750, 200), new P(700, 160), new P(610, 130)], true),
  ...positionsFromPoints([new P(250, 450), new P(350, 420)], false),
  ...positionsFromPoints([new P(200, 210), new P(240, 240)], false),
  ...positionsFromPoints([new P(750, 20), new P(800, 20)]),
  ...positionsFromPoints([new P(750, 120), new P(800, 120)]),
];

surfaces[1].type = SurfaceType.Ice;
surfaces[5].type = SurfaceType.Ice;

const loading:LoadingConfig[] = [
  { position: new Rectangle(100, 100, 0, 100).DiagonalA, levelId: LevelId.test },
  { position: new Rectangle(750, 20, 0, 100).DiagonalA, levelId: LevelId.test2, zone: 1 },
];

const size = new P(800, 500); // todo: calculate dynamically
const cfg:LevelConfig = {
  minSize: size, walls: surfaces.concat(loading), entities, music,
};

export default cfg;
