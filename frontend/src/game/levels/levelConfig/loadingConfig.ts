import { Line } from '../../shapes';
import LevelId from '../levelsList/levelIds';

type LoadingConfig = {
  position:Line
  levelId:LevelId
  zone?:number
};

export default LoadingConfig;
