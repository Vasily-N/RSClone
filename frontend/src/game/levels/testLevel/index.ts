import LevelId from '../typeLevelIds';
import { Point, Rectangle } from '../../../shapes';
import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, surfaceListHelper,
} from '../typeConfigs';

const entities:EntityConfig[] = [];

const surfaces:SurfaceConfig[] = [];

const loading:LoadingConfig[] = [];

surfaces.push(...surfaceListHelper([
  Point.Zero, new Point(0, 400), new Point(200, 400), new Point(200, 500),
  new Point(400, 500), new Point(400, 400), new Point(800, 400), new Point(800, 0),
  Point.Zero,
]));

surfaces.push({ position: new Rectangle(200, 300, 200, 0).DiagonalA, platform: true });
surfaces.push(...[{ position: new Rectangle(100, 0, 200, 200).DiagonalA, platform: true },
  { position: new Rectangle(300, 200, 200, 0).DiagonalA, platform: true }]);

const levelId = LevelId.test;
loading[0] = { position: new Rectangle(100, 100, 0, 100).DiagonalA };
loading[1] = { position: new Rectangle(500, 100, 0, 100).DiagonalA, levelId, zone: 0 };
loading[2] = { position: new Rectangle(400, 100, 100, 0).DiagonalA, levelId, zone: 3 };
loading[3] = { position: new Rectangle(400, 300, 100, 0).DiagonalA, levelId, zone: 2 };
loading[4] = { position: new Rectangle(50, 300, 100, 100).DiagonalB, levelId, zone: 5 };
loading[5] = { position: new Rectangle(500, 300, 100, 100).DiagonalB, levelId, zone: 4 };

const size = new Point(2000, 2000);
const cfg:LevelConfig = {
  size, surfaces, entities, loading,
};

export default cfg;
