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

loading.push({ position: new Rectangle(0, 0, 0, 1000).Diagonal, levelId: LevelId.test, zone: 1 });

const cfg:LevelConfig = { surfaces, entities, loading };

export default cfg;
