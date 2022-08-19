import IGameSettings from './settings.interface';

class GameSettings implements IGameSettings {
  private drawBoxes = true;
  public get DrawBoxes():boolean { return this.drawBoxes; }
  public set DrawBoxes(value:boolean) { this.drawBoxes = value; }
  private fpsDisplay = true;
  public get FpsDisplay():boolean { return this.fpsDisplay; }
  public set FpsDisplay(value:boolean) { this.fpsDisplay = value; }
  private fpsLimit = 0;
  private frameTimeLimit = Infinity;
  public get FrameTimeLimit():number { return this.frameTimeLimit; }
  public set FrameTimeLimit(value:number) { this.FpsLimit = Math.ceil(1000 / value); }
  private static readonly fpsLimitAdd = 1;
  private static readonly fpsLimitMult = 1.1;
  public get FpsLimit():number {
    return Math.max(
      this.fpsLimit - GameSettings.fpsLimitAdd,
      Math.round(this.fpsLimit / GameSettings.fpsLimitMult),
    );
  }

  public set FpsLimit(value:number) {
    this.fpsLimit = value
                && Math.min(value + GameSettings.fpsLimitAdd, value * GameSettings.fpsLimitMult);
    // because some 60 Hz screens are ackshually 60.5 Hz
    this.frameTimeLimit = 1000 / this.fpsLimit;
  }

  public constructor(fpsLimit = 0) {
    this.FpsLimit = fpsLimit;
  }
}

export default GameSettings;
