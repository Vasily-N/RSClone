import { Line, Point } from '../../shapes';
import SurfaceType from '../../types';

type SurfaceConfig = {
  type?:SurfaceType
  platform?:boolean
  position:Line
};

const surfaceLinesFromPoints = (points:Point[], platform?:boolean, type?:SurfaceType)
:SurfaceConfig[] => points
  .reduce((res:Line[], p:Point) => res.concat(new Line(res.at(-1)?.B || Point.Zero, p)), [])
  .slice(1)
  .map((position:Line) => ({ position, ...type && { type }, ...platform && { platform } }));

export { SurfaceConfig, surfaceLinesFromPoints };
