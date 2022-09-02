import Character from '../../character';
import { Point, Rectangle } from '../../shapes';

class Camera {
  private area:Rectangle;
  private target:Point = Point.Zero;
  private current:Point = Point.Zero;
  public get Current():Point { return this.current; }
  private static readonly cameraSpeed = 90;
  private static readonly cameraShift = new Point(1 / 15, 6 / 11);
  private lastZoom = -1;
  private lastViewSize = Point.Zero;

  public constructor(area:Rectangle) {
    this.area = area;
  }

  public resetPosition():void {
    this.lastZoom = -1;
  }

  public process(char:Character, viewSize:Point, zoom:number, elapsedSeconds:number):void {
    // some doublicate-code, I wasn't able to find how in TS dynamically access setters field
    // I specially used Size[key] instead of Width/Height to easily see the doublicate-code
    const areaZoom = this.area.multiply(zoom);
    if (viewSize.X > areaZoom.Size.X) {
      this.target.X = (areaZoom.Size.X - viewSize.X) / 2;
      this.current.X = this.target.X;
    } else {
      const shiftX = 0.5 + (char.Direction ? Camera.cameraShift.X : -Camera.cameraShift.X);
      const newTargetCameraX = zoom * char.Position.X - viewSize.X * shiftX;
      const maxPosX = areaZoom.Size.X - viewSize.X;
      this.target.X = Math.min(Math.max(newTargetCameraX, areaZoom.X), maxPosX);
      if (this.current.X !== this.target.X) {
        const newCurrentCameraX = this.current.X + elapsedSeconds * char.VelocityX * zoom;
        this.current.X = Math.min(Math.max(newCurrentCameraX, areaZoom.X), maxPosX);
      }
    }

    // Y is always centered so no code for Y-camera-movement
    if (viewSize.Y > areaZoom.Size.Y) {
      this.current.Y = (areaZoom.Size.Y - viewSize.Y) / 2;
    } else {
      const shiftY = Camera.cameraShift.Y;
      const newCameraY = zoom * char.Position.Y - viewSize.Y * shiftY;
      const maxPosY = areaZoom.Size.Y - viewSize.Y;
      this.current.Y = Math.min(Math.max(newCameraY, areaZoom.Y), maxPosY);
    }

    if (this.lastZoom !== zoom || this.lastViewSize !== viewSize) {
      this.current.X = this.target.X;
      this.lastZoom = zoom;
      this.lastViewSize = viewSize;
    } else if (this.current.X !== this.target.X) {
      const cameraShift = elapsedSeconds * Camera.cameraSpeed * Math.sqrt(zoom);
      this.current.X = (this.current.X > this.target.X)
        ? Math.max(this.current.X - cameraShift, this.target.X)
        : Math.min(this.current.X + cameraShift, this.target.X);
    }
  }
}

export default Camera;
