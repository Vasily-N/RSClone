import { Point, Line } from '../../shapes';
import SurfaceType from '../../types';
import SurfaceConfig from './surfaceConfig';

function positionsFromPoints(points:Point[], platform?:boolean, type?:SurfaceType):SurfaceConfig[] {
  return points
    .reduce((res:Line[], p:Point) => res.concat(new Line(res.at(-1)?.B || Point.Zero, p)), [])
    .slice(1)
    .map((position:Line) => ({ position, ...type && { type }, ...platform && { platform } }));
}

export default positionsFromPoints;
