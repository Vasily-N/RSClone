import IGameSettings from './settings.interface';

class Settings implements IGameSettings {
  private drawBoxes = true;
  public get DrawBoxes():boolean { return this.drawBoxes; }
  public set DrawBoxes(value:boolean) { this.drawBoxes = value; }
  private fpsDisplay = true;
  public get FpsDisplay():boolean { return this.fpsDisplay; }
  public set FpsDisplay(value:boolean) { this.fpsDisplay = value; }
}

export default Settings;
