import { Point } from '../../shapes';
import IGameSettings from './iGameSettings';

class GameSettings implements IGameSettings {
  private drawBoxes = false;
  public get DrawBoxes():boolean { return this.drawBoxes; }
  public set DrawBoxes(value:boolean) { this.drawBoxes = value; }

  private drawSurfaces = true;
  public get DrawSurfaces():boolean { return this.drawSurfaces; }
  public set DrawSurfaces(value:boolean) { this.drawSurfaces = value; }

  private fpsDisplay = true;
  public get FpsDisplay():boolean { return this.fpsDisplay; }
  public set FpsDisplay(value:boolean) { this.fpsDisplay = value; }

  // because some 60 Hz screens are ackshually 60.5 Hz
  private static readonly fpsLimitAdd = 1;
  private static readonly fpsLimitMult = 1.1;
  private fpsLimitSet = 0;
  private fpsLimitSafer = 0;
  private frameTimeLimit = Infinity;
  public get FrameTimeLimit():number { return this.frameTimeLimit; }
  public set FrameTimeLimit(value:number) { this.FpsLimit = Math.ceil(1000 / value); }
  public get FrameLimitSafer():number { return this.fpsLimitSafer; }
  public set FrameLimitSafer(value:number) { this.FpsLimit = value; }
  public get FpsLimit():number { return this.fpsLimitSet; }
  public set FpsLimit(value:number) {
    this.fpsLimitSet = value;
    this.fpsLimitSafer = value
                  && Math.min(value + GameSettings.fpsLimitAdd, value * GameSettings.fpsLimitMult);
    this.frameTimeLimit = 1000 / this.fpsLimitSafer;
  }

  private renderSize:Point = Point.Zero;
  public get RenderSize():Point { return this.renderSize; }
  public set RenderSize(value:Point) { this.renderSize = value; }
  public RenderSizeSet(value:{ width:number, height:number }):void {
    this.renderSize = new Point(value.width, value.height);
  }

  private renderZone:CanvasRenderingContext2D | null = null;
  public set RenderZone(value:CanvasRenderingContext2D) { this.renderZone = value; }
  public get RenderZone():CanvasRenderingContext2D {
    if (!this.renderZone) throw new Error("Render Zone doesn't exist");
    return this.renderZone;
  }

  private zoom = 2;
  private static readonly zoomMax = 3;
  public get Zoom():number { return this.zoom; }
  public set Zoom(value:number) {
    const newValue = Math.min(GameSettings.zoomMax, Math.max(value, 1));
    if (newValue === this.zoom) return;
    this.zoom = newValue;
    this.zoomSubscribers.forEach((f) => f());
  }

  private readonly zoomSubscribers:(() => void)[] = [];
  public ZoomChangeSubscribe(callback:() => void):()=>void {
    this.zoomSubscribers.push(callback);
    return () => {
      const index = this.zoomSubscribers.indexOf(callback);
      if (index > -1) this.zoomSubscribers.splice(index, 1);
    };
  }

  public constructor(fpsLimit = 0) {
    this.FpsLimit = fpsLimit;
  }
}

export { GameSettings, IGameSettings };
