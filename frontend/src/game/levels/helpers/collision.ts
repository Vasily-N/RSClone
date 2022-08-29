import { Point, Line, Rectangle } from '../../shapes';
import {
  LevelLoad as Load, Surface, Position,
} from '../types';
import { LoadingConfig as LoadZone } from '../levelConfig';
import { Entity } from '../../entity';
import { LevelId } from '../levelsList';

type FloorCollision = { surface?:Surface, point:Point } | null;

class Collision {
  // this should be recoded but I don't have time
  private static filterNear<T>(array:Position[], checkZone:Rectangle):T[] {
    return array
      .filter((s) => s.position.MinX <= checkZone.Right
                  && s.position.MaxX >= checkZone.Left
                  && s.position.MinY <= checkZone.Bottom
                  && s.position.MaxY >= checkZone.Top) as unknown as T[]; // is there a better way?
  }

  private static linesIntersect(line1:Line, line2:Line):number | null {
    const line1Vect:Point = line1.B.minus(line1.A);
    const line2Vect:Point = line2.B.minus(line2.A);

    const line2Pos = (line2Vect.X * (line1.A.Y - line2.A.Y) - line2Vect.Y * (line1.A.X - line2.A.X))
                   / (line1Vect.X * line2Vect.Y - line1Vect.Y * line2Vect.X);
    if (line2Pos < 0 || line2Pos > 1 || Number.isNaN(line2Pos)) return null;

    const line1Pos = (line1Vect.X * (line1.A.Y - line2.A.Y) - line1Vect.Y * (line1.A.X - line2.A.X))
                   / (line1Vect.X * line2Vect.Y - line2Vect.X * line1Vect.Y);
    if (line1Pos < 0 || line1Pos > 1 || Number.isNaN(line1Pos)) return null;

    return line2Pos;
  }

  private static percentOnLine(p:number, s:number, l:number) {
    return Math.abs(p - s) / l;
  }

  private static getCheckZone(move:Line):Rectangle {
    const top = Math.floor(move.MinY);
    const height = Math.ceil(move.MaxY - top);
    const left = Math.floor(move.MinX);
    const width = Math.ceil(move.MaxX - left);
    return new Rectangle(left, top, width, height);
  }

  public static processExitZones(loadExit:LoadZone[], move:Line):Load | null {
    const exits = Collision.filterNear<LoadZone>(loadExit, Collision.getCheckZone(move));
    if (!exits.length) return null;
    // should add sort check for 2 zones nearly and direction but I don't care
    for (let i = exits.length - 1; i > -1; i -= 1) {
      const exit = exits[i];
      const exitPos = exit.position;
      const position = Collision.linesIntersect(exitPos, move);
      if (position === null) continue;
      if (move.A.X === exit.position.MinX && move.A.X === exit.position.MaxX) continue;
      const levelId = exit.levelId as LevelId;
      const zone = exit.zone as number;
      return { levelId, zone, position };
    }
    return null;
  }

  private static processFloorsDot(
    e:Entity,
    floors:Surface[],
    move:Line,
    onFloor:boolean,
  ):FloorCollision {
    if (!floors.length) return null;
    if (floors.length > 1) floors.sort((a, b) => b.position.MaxY - a.position.MaxY);
    // prevent teleport down with very low fps aka 10 seconds per frame

    for (let i = floors.length - 1; i > -1; i -= 1) {
      const floorPos = floors[i].position;
      const percentBefore = Collision.percentOnLine(move.A.X, floorPos.A.X, floorPos.DifXabs);
      const yBefore = floorPos.DifYabs * percentBefore + floorPos.MinY;
      if (yBefore < move.A.Y - (onFloor ? e.Collision.Height : 0)) continue;
      // platform was above the characrter
      const percentegeAfter = Collision.percentOnLine(move.B.X, floorPos.A.X, floorPos.DifXabs);
      const yAfter = floorPos.DifYabs * percentegeAfter + floorPos.MinY;
      if (!onFloor && yAfter > move.B.Y) continue;
      return { surface: floors[i], point: new Point(move.B.X, yAfter) };
    }

    return null;
  }

  private static processFloorSub(
    e:Entity,
    fllors:Surface[],
    zone:Rectangle,
    move:Line,
    onFloor:boolean,
  ):FloorCollision {
    const nearFloors = Collision.filterNear<Surface>(fllors, zone);
    return Collision.processFloorsDot(e, nearFloors, move, onFloor);
  }

  public static processFloor(e:Entity, surfaces:Surface[], move:Line):FloorCollision {
    const checkTop = Math.floor(move.MinY - e.Collision.Height / 4);
    const checkHeight = Math.ceil(move.MaxY - checkTop + e.Collision.Height / 4);
    const dotZone = new Rectangle(move.B.X, checkTop, 0, checkHeight);

    const floorCollisionDotPos = Collision.processFloorSub(e, surfaces, dotZone, move, e.OnSurface);
    if (floorCollisionDotPos) return floorCollisionDotPos;
    return null;
    const col = e.Collision.plusPoint(e.Position);
    const colZone = new Rectangle(col.Left, checkTop, col.Width, checkHeight);
    return Collision.processFloorSub(e, surfaces, colZone, move, e.OnSurface);
  }

  private static processCeilDot(floors:Surface[], move:Line):FloorCollision {
    if (!floors.length) return null;
    if (floors.length > 1) floors.sort((a, b) => -(b.position.MaxY - a.position.MaxY));
    // prevent teleport down with very low fps aka 10 seconds per frame

    for (let i = floors.length - 1; i > -1; i -= 1) {
      const floorPos = floors[i].position;
      const percentBefore = Collision.percentOnLine(move.A.X, floorPos.A.X, floorPos.DifXabs);
      const yBefore = floorPos.DifYabs * percentBefore + floorPos.MinY;
      if (yBefore > move.A.Y) continue; // platform was below the characrter
      const percentegeAfter = Collision.percentOnLine(move.B.X, floorPos.A.X, floorPos.DifXabs);
      const yAfter = floorPos.DifYabs * percentegeAfter + floorPos.MinY;
      if (yAfter < move.B.Y) continue;
      return { surface: floors[i], point: new Point(move.B.X, yAfter) };
    }

    return null;
  }

  private static ceilThr = 1.5;
  public static processCeil(surfaces:Surface[], e:Entity, move:Line):FloorCollision {
    const col = e.Collision.plusPoint(e.Position);
    const move2 = new Line(
      new Point(move.A.X, move.A.Y - col.Height),
      new Point(move.B.X, move.B.Y - col.Height),
    );
    const top = Math.floor(move2.MinY);
    const left = col.Left + Collision.ceilThr;
    const height = Math.ceil(move2.MaxY - top);
    const width = col.Width - Collision.ceilThr * 2;
    const ceilsZone = new Rectangle(left, top, width, height);
    const nearFloors = Collision.filterNear<Surface>(surfaces, ceilsZone);
    return Collision.processCeilDot(nearFloors, move2);
  }

  private static RayVsRect(ray:Line, target:Rectangle):Line | null {
    const rayPos = ray.A; const direction = ray.Direction;
    const invdir:Point = new Point(1.0 / direction.X, 1.0 / direction.Y);
    const tNear:Point = target.Position.minus(rayPos).multiplyPoint(invdir);
    const tFar:Point = target.BottomRight.minus(rayPos).multiplyPoint(invdir);

    if (Number.isNaN(tFar.Y) || Number.isNaN(tFar.X)) return null;
    if (Number.isNaN(tNear.Y) || Number.isNaN(tNear.X)) return null;

    if (tNear.X > tFar.X) [tNear.X, tFar.X] = [tFar.X, tNear.X];
    if (tNear.Y > tFar.Y) [tNear.Y, tFar.Y] = [tFar.Y, tNear.Y];
    if (tNear.X > tFar.Y || tNear.Y > tFar.X) return null;
    const tHitNear:number = Math.max(tNear.X, tNear.Y);
    const tHitFar:number = Math.min(tFar.X, tFar.Y);

    if (tHitFar < 0) return null;

    const contact1 = rayPos.plus(direction.multiply(tHitNear));
    const contact2 = rayPos.plus(direction.multiply(tHitFar));

    return new Line(contact1, contact2);
  }

  public static processWalls(surfaces:Surface[], e:Entity, move:Line):FloorCollision {
    const colVal = e.Collision;
    const colPos = colVal.plusPoint(e.Position);
    const colPrev = colPos.minusPoint(move.Direction);
    const zoneCheck = Rectangle.fromLine(new Line(
      new Point(Math.min(colPos.Left, colPrev.Left), Math.min(colPos.Top, colPrev.Top)),
      new Point(Math.max(colPos.Right, colPrev.Right), Math.max(colPos.Bottom, colPrev.Bottom)),
    ));

    const nearWalls = Collision.filterNear<Surface>(surfaces, zoneCheck);
    for (let i = nearWalls.length - 1; i > -1; i -= 1) {
      const walPos = nearWalls[i].position;
      const res = this.RayVsRect(walPos, colPos);
      if (res) {
        if (colPrev.Bottom <= walPos.MinY) {
          return { surface: nearWalls[i], point: new Point(move.B.X, walPos.MinY) };
        }
        if (colPrev.Top >= walPos.MaxY) {
          return { point: new Point(move.B.X, walPos.MaxY + colVal.Height + 1) };
        }
        if (res?.A.X === res?.B.X) {
          return {
            point: new Point(
              colPrev.X < colPos.X ? walPos.MinX - colVal.Right : walPos.MaxX - colVal.Left,
              move.B.Y,
            ),
          };
        }
        throw new Error('why do you have not straigh walls?!');
      }
    }
    return null;
  }

  public static processCeil2(surfaces:Surface[], e:Entity, move:Line):FloorCollision | null {
    const colVal = e.Collision;
    const colPos = colVal.plusPoint(e.Position);
    const colPrev = colPos.minusPoint(move.Direction);
    const nearCeils = Collision.filterNear<Surface>(surfaces, colPos);
    for (let i = nearCeils.length - 1; i > -1; i -= 1) {
      const ceilPos = nearCeils[i].position;
      const res = Collision.RayVsRect(ceilPos, colPos);
      if (!res) continue;
      if (Math.abs(ceilPos.MinX - res.A.X) < Math.abs(res.B.X - ceilPos.MaxX)) {
        if (ceilPos.MinX < colPos.Left) continue;
        const y = ceilPos.MinX === ceilPos.B.X ? ceilPos.B.Y : ceilPos.A.Y;
        const b = (ceilPos.MinY !== ceilPos.MaxY) && (y === ceilPos.MinY) ? 0.48 : 0;
        if (colPrev.Bottom <= (y + b)) {
          if (colPos.Bottom < y - b) continue;
          return { surface: nearCeils[i], point: new Point(move.B.X, y - colVal.Bottom - b) };
        }
        if (ceilPos.MinX + 4 < colPrev.Right) continue;
        return { point: new Point(ceilPos.MinX - colVal.Right, move.B.Y) };
      }

      if (ceilPos.MaxX > colPos.Right) continue;
      const y = ceilPos.MaxX === ceilPos.A.X ? ceilPos.A.Y : ceilPos.B.Y;
      const b = (ceilPos.MinY !== ceilPos.MaxY) && (y === ceilPos.MinY) ? 0.48 : 0;
      if (colPrev.Bottom <= (y + b)) {
        if (colPos.Bottom < y - b) continue;
        return { surface: nearCeils[i], point: new Point(move.B.X, y - colVal.Bottom - b) };
      }
      if (ceilPos.MaxX - 4 > colPrev.Left) continue;
      return { point: new Point(ceilPos.MaxX - colVal.Left, move.B.Y) };
    }
    return null;
  }
}

export default Collision;
