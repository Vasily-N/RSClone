import Character from './character';
import Controls from './services/controls';
import CanvasHelper from './helperTypes/canvasHelper';
import IControlsSettings from './services/controls/iControlsSettings';
import IGameSettings from './services/settings/iGameSettings';
import LevelId from './levels/typeLevelIds';
import Level from './levels';
import levelList from './levels/list';
import LevelLoad from './levels/typeLoad';

interface IGame {
  start:(context:CanvasRenderingContext2D)=>void;
}

class Game {
  private canvasHelper:CanvasHelper;
  private readonly char:Character;
  private readonly gameSettings:IGameSettings;
  private lastFrame = 0;
  private levels:Partial<Record<LevelId, Level>> = {};
  private levelIdCurrent?:LevelId;
  private levelCurrent:Level;

  private initContext() {
    this.canvasHelper.c.font = '48px serif';
    this.canvasHelper.c.fillStyle = 'white';
  }

  constructor(controlsSettings:IControlsSettings, gameSettings:IGameSettings, c:CanvasHelper) {
    this.char = new Character(new Controls(controlsSettings));
    this.gameSettings = gameSettings;
    this.canvasHelper = c;
    this.initContext();
    this.requestNextFrame();
    this.levelCurrent = this.changeLevel({ levelId: LevelId.test, zone: 0, position: 1 }); // temp
  }

  private getLevel(id:LevelId):Level {
    if (!this.levels[id]) this.levels[id] = new Level(levelList[id]);
    return this.levels[id] as Level;
  }

  private changeLevel(load:LevelLoad):Level {
    const portal = this.levelIdCurrent === load.levelId;
    if (!portal) {
      this.levelIdCurrent = load.levelId;
      this.levelCurrent = this.getLevel(load.levelId);
    }
    this.levelCurrent.load(this.char, load.zone, load.position, portal);
    return this.levelCurrent;
  }

  private requestNextFrame() {
    window.requestAnimationFrame(this.frame.bind(this));
  }

  private processFrame(elapsed:number):void {
    const { c, size } = this.canvasHelper;
    const load = this.levelCurrent.frame(elapsed / 1000);
    if (load) this.changeLevel(load);

    c.clearRect(0, 0, size.X, size.Y);
    c.beginPath();
    this.levelCurrent.draw(c, this.gameSettings.DrawBoxes);

    if (this.gameSettings.FpsDisplay) c.fillText(`FPS: ${(1000 / elapsed).toFixed(1)}`, 5, 10);
  }

  private frame(frametime:number):void {
    const elapsed = frametime - this.lastFrame;
    if (!Number.isFinite(this.gameSettings.FrameTimeLimit)
    || elapsed > this.gameSettings.FrameTimeLimit) {
      if (this.lastFrame) this.processFrame(elapsed);
      this.lastFrame = frametime;
    }
    this.requestNextFrame();
  }
}

export { Game, IGame };
