import { Line } from '../../shapes';
import SurfaceType from '../../types';

type SurfaceConfig = {
  type?:SurfaceType
  platform?:boolean
  position:Line
};

export default SurfaceConfig;
