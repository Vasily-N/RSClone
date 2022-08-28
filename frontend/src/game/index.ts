import Character from './character';
import { IControlsSettings, Controls, ControlsAction as Action } from './services/controls';

import { IGameSettings } from './services/settings';
import { Level, LevelLoad } from './levels';
import { LevelId, levelList } from './levels/levelsList';

type WinTheGame = {
  elapsedSeconds:number
};

type WinCallback = (win:WinTheGame)=>void;
type PauseCallback = ()=>void;

interface IGame {
  start:(winCallback?:WinCallback)=>void;
  pauseToggle:()=>void;
}

class Game implements IGame {
  private readonly char:Character;
  private readonly gameSettings:IGameSettings;
  private lastFrame = 0;
  private levels:Partial<Record<LevelId, Level>> = {}; // will a lot of levels cause a memory leak?
  private levelIdCurrent?:LevelId;
  private levelCurrent:Level;
  private controls:Controls;
  private pause = false;
  private winCallback?:WinCallback;
  private pauseCallback?:PauseCallback;
  private totalElapsed = 0;

  private static RenderError = new Error("the game can't process without canvas");

  constructor(controlsSettings:IControlsSettings, gameSettings:IGameSettings) {
    this.controls = new Controls(controlsSettings);
    this.char = new Character(this.controls);
    this.gameSettings = gameSettings;
    this.levelCurrent = this.changeLevel({ levelId: LevelId.test2, zone: 0, position: 0 }); // temp
  }

  public start(winCallback?:WinCallback, pauseCallback?:PauseCallback):void {
    this.requestNextFrame();
    this.totalElapsed = 0;
    this.winCallback = winCallback;
    this.pauseCallback = pauseCallback;
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

  private static fontSize = 24;
  private static drawFps(c:CanvasRenderingContext2D, fontSize:number, elapsedMs:number) {
    const cLocal = c;
    cLocal.font = `${fontSize}px serif`;
    cLocal.fillStyle = 'white';
    cLocal.fillText(`FPS: ${(1000 / elapsedMs).toFixed(1)}`, 5, fontSize);
  }

  private processFrame(elapsed:number):boolean { // sholw be "EventType"
    const c = this.gameSettings.getRenderZone();
    if (!c) throw Game.RenderError;
    c.lineWidth = 3;
    c.imageSmoothingEnabled = false; // IDK why it resets between frames
    const { RenderSize: size, Zoom: zoom } = this.gameSettings;

    c.clearRect(0, 0, size.X, size.Y);
    const elapsedSeconds = Math.min(elapsed / 1000, this.gameSettings.FrameTimeLimitMin);
    this.totalElapsed += elapsedSeconds;
    const load = this.levelCurrent.frame(elapsedSeconds, size, zoom);
    if (load?.levelId === LevelId.winTheGame) return true;
    this.levelCurrent.draw(c, zoom, this.gameSettings.DrawBoxes, this.gameSettings.DrawSurfaces);

    if (this.gameSettings.FpsDisplay) Game.drawFps(c, Game.fontSize, elapsed);

    if (load) this.changeLevel(load);
    return false;
  }

  private frame(frametime:number):void {
    if (this.controls.has(Action.pause, true)) this.pauseToggle();
    const elapsed = frametime - this.lastFrame;
    if (this.controls.has(Action.zoomUp, true)) this.gameSettings.Zoom += 1;
    if (this.controls.has(Action.zoomDown, true)) this.gameSettings.Zoom -= 1;
    if (!Number.isFinite(this.gameSettings.FrameTimeLimit)
    || elapsed >= this.gameSettings.FrameTimeLimit) {
      if (this.lastFrame && !this.pause) {
        if (this.processFrame(elapsed)) {
          const elapsedSeconds = this.totalElapsed;
          if (this.winCallback) this.winCallback({ elapsedSeconds });
          return;
        }
      }
      this.lastFrame = frametime;
    }
    this.requestNextFrame();
  }

  public pauseToggle():void {
    this.pause = !this.pause;
    if (this.pauseCallback) this.pauseCallback();
  }
}

export { Game, IGame, WinTheGame };
