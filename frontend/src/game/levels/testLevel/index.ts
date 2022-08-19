import LevelId from '../typeLevelIds';
import Rectangle from '../../helperTypes/rectangle';
import {
  EntityConfig, LevelConfig, LoadingConfig, SurfaceConfig,
} from '../typeConfigs';

const entities:EntityConfig[] = [];

const surfaces:SurfaceConfig[] = [];

const loading:LoadingConfig[] = [];

surfaces.push({ position: new Rectangle(0, 500, 100500, 500).Diagonal });
surfaces.push({ position: new Rectangle(0, 400, 100500, 500).Diagonal, platform: true });

const levelId = LevelId.test;
loading[0] = { position: new Rectangle(100, 100, 0, 100).Diagonal, levelId, zone: 1 };

const cfg:LevelConfig = { surfaces, entities, loading };

export default cfg;
