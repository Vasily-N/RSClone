import LevelId from '../typeLevelIds';
import Rectangle from '../../helperTypes/rectangle';
import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig, surfaceListHelper,
} from '../typeConfigs';
import Point from '../../helperTypes/point';

const entities:EntityConfig[] = [];

const surfaces:SurfaceConfig[] = [];

const loading:LoadingConfig[] = [];

surfaces.push(...surfaceListHelper([
  Point.Zero, new Point(0, 400), new Point(200, 400), new Point(200, 500),
  new Point(400, 500), new Point(400, 400), new Point(800, 400), new Point(800, 0),
  Point.Zero,
]));

surfaces.push({ position: new Rectangle(200, 300, 200, 0).Diagonal, platform: true });
surfaces.push(...[{ position: new Rectangle(100, 0, 200, 200).Diagonal, platform: true },
  { position: new Rectangle(300, 200, 200, 0).Diagonal, platform: true }]);

const levelId = LevelId.test;
loading[0] = { position: new Rectangle(100, 100, 0, 100).Diagonal, levelId, zone: 1 };

const size = new Point(2000, 2000);
const cfg:LevelConfig = {
  size, surfaces, entities, loading,
};

export default cfg;
