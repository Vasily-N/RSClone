import { Line } from '../../shapes';
import SurfaceType from '../../types/surfaceType';

type Surface = { type:SurfaceType, platform:boolean, position:Line, angle:number };

export default Surface;
