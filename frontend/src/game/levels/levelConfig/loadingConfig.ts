import { Line } from '../../shapes';
import LevelId from '../types/levelIds';

type LoadingConfig = {
  position:Line
  levelId?:LevelId
  zone?:number
};

export default LoadingConfig;
