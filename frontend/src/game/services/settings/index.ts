import { Point } from '../../shapes';
import IGameSettings from './iGameSettings';

class GameSettings implements IGameSettings {
  private drawBoxes = false;
  public get DrawBoxes():boolean { return this.drawBoxes; }
  public set DrawBoxes(value:boolean) { this.drawBoxes = value; }

  private drawSurfaces = false;
  public get DrawSurfaces():boolean { return this.drawSurfaces; }
  public set DrawSurfaces(value:boolean) { this.drawSurfaces = value; }

  private fpsDisplay = true;
  public get FpsDisplay():boolean { return this.fpsDisplay; }
  public set FpsDisplay(value:boolean) { this.fpsDisplay = value; }

  private timeDisplay = true;
  public get TimeDisplay():boolean { return this.timeDisplay; }
  public set TimeDisplay(value:boolean) { this.timeDisplay = value; }

  // todo: refactor to separate class
  private fpsLimitMin = 15;
  public get FpsLimitMin():number { return this.fpsLimitMin; }

  private frameTimeLimitMax = Math.ceil(1000 / this.fpsLimitMin);
  public get FrameTimeLimitMax():number { return this.frameTimeLimitMax; }

  private frameTimeLimit = Infinity;
  public get FrameTimeLimit():number { return this.frameTimeLimit; }
  public set FrameTimeLimit(value:number) { this.FpsLimit = Math.ceil(1000 / value); }

  private fpsLimitSafer = Infinity;
  public get FrameLimitSafer():number { return this.fpsLimitSafer; }
  public set FrameLimitSafer(value:number) { this.FpsLimit = value; }

  // because some 60 Hz screens are ackshually 60.5 Hz
  private static readonly fpsLimitAdd = 1;
  private static readonly fpsLimitMult = 1.1;
  private fpsLimitSet = Infinity;
  public get FpsLimit():number { return this.fpsLimitSet; }
  public set FpsLimit(value:number) {
    this.fpsLimitSet = value;
    this.fpsLimitSafer = value && Math.max(
      Math.min(value + GameSettings.fpsLimitAdd, value * GameSettings.fpsLimitMult),
      this.fpsLimitMin,
    );
    this.frameTimeLimit = GameSettings.FpsToTimeLimit(this.fpsLimitSafer);
  }

  private static FpsToTimeLimit(fps:number):number {
    return 1000 / fps;
  }

  private renderSize:Point = Point.Zero;
  public get RenderSize():Point { return this.renderSize; }
  public set RenderSize(value:Point) { this.renderSize = value; }

  public RenderSizeSet(value:{ width:number, height:number }):void {
    this.renderSize = new Point(value.width, value.height);
  }

  public RenderSizeGet():{ width:number, height:number } {
    return { width: this.renderSize.X, height: this.renderSize.Y };
  }

  private renderZone:CanvasRenderingContext2D | null = null;
  public setRenderZone(value:CanvasRenderingContext2D | null) { this.renderZone = value; }
  public getRenderZone():CanvasRenderingContext2D | null { return this.renderZone; }

  private zoom = 4;
  private readonly zoomMax = 4;
  public get ZoomMax():number { return this.zoomMax; }
  private readonly zoomMin = 1;
  public get ZoomMin():number { return this.zoomMin; }
  public get Zoom():number { return this.zoom; }
  public set Zoom(value:number) {
    const newValue = Math.min(this.zoomMax, Math.max(value, this.zoomMin));
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

  public constructor(fpsLimit = 0, fpsLimitMin = 10) {
    this.FpsLimit = fpsLimit;
    this.fpsLimitMin = fpsLimitMin;
    this.frameTimeLimitMax = GameSettings.FpsToTimeLimit(fpsLimitMin);
  }
}

export { GameSettings, IGameSettings };
