import { Point, Rectangle } from '../../../shapes';
import SurfaceType from '../../../types';

import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, surfaceLinesFromPoints,
} from '../../levelConfig';
import LevelId from '../levelIds';

const entities:EntityConfig[] = [];

const surfaces:SurfaceConfig[] = [];

const loading:LoadingConfig[] = [];

surfaces.push(...surfaceLinesFromPoints([
  Point.Zero, new Point(0, 400), new Point(200, 400), new Point(200, 500),
  new Point(400, 500), new Point(400, 400), new Point(800, 400), new Point(800, 0),
  Point.Zero,
]));

surfaces.push({ position: new Rectangle(200, 300, 200, 0).DiagonalA, platform: true });
surfaces.push(...[
  { position: new Rectangle(100, 0, 200, 200).DiagonalA, platform: true },
  { position: new Rectangle(300, 200, 200, 0).DiagonalA, platform: true },
  ...surfaceLinesFromPoints([
    new Point(780, 250), new Point(750, 250), new Point(650, 300), new Point(600, 340),
    new Point(560, 350),
  ], true),
  ...surfaceLinesFromPoints([
    new Point(550, 250), new Point(560, 240), new Point(570, 220),
  ], true),
  ...surfaceLinesFromPoints([new Point(200, 400), new Point(210, 400), new Point(210, 500)]),
  ...surfaceLinesFromPoints([new Point(750, 200), new Point(700, 160), new Point(610, 130)], true),
  ...surfaceLinesFromPoints([new Point(250, 450), new Point(350, 420)], false),
  ...surfaceLinesFromPoints([new Point(200, 210), new Point(240, 240)], false),
]);

surfaces[1].type = SurfaceType.Ice;
surfaces[5].type = SurfaceType.Ice;
surfaces[17].platform = true;

const levelId = LevelId.test;
loading[0] = { position: new Rectangle(100, 100, 0, 100).DiagonalA };
loading[1] = { position: new Rectangle(500, 100, 0, 100).DiagonalA, levelId, zone: 0 };
loading[2] = { position: new Rectangle(400, 100, 100, 0).DiagonalA, levelId, zone: 3 };
loading[3] = { position: new Rectangle(400, 300, 100, 0).DiagonalA, levelId, zone: 2 };
loading[4] = { position: new Rectangle(60, 300, 50, 50).DiagonalB, levelId, zone: 5 };
loading[5] = { position: new Rectangle(360, 300, 50, 50).DiagonalB, levelId, zone: 4 };

const size = new Point(800, 500); // todo: calculate dynamically
const cfg:LevelConfig = {
  minSize: size, surfaces, entities, loading,
};

export default cfg;
