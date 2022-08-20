import { Line, Point } from '../../../shapes';
import SurfaceType from '../types/surfaceType';

type SurfaceConfig = {
  type?:SurfaceType
  platform?:boolean
  position:Line
};

const surfaceConfigList = (points:Point[]):SurfaceConfig[] => points
  .reduce((res:Line[], p:Point) => res.concat(new Line(res.at(-1)?.B || Point.Zero, p)), [])
  .slice(1)
  .map((position:Line) => ({ position }));

export { SurfaceConfig, surfaceConfigList };
