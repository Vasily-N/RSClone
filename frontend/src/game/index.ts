import Character from './character';
import { IControlsSettings, Controls, ControlsAction as Action } from './services/controls';

import { IGameSettings } from './services/settings';
import { Level, LevelLoad } from './levels';
import { LevelId, levelList } from './levels/levelsList';
import { ISoundPlay } from './services/sound';
import GameSoundPlay from './soundPlay';

type WinTheGame = {
  elapsedSeconds:number
};

type WinCallback = (win:WinTheGame)=>void;
type PauseCallback = ()=>void;

interface IGame {
  start:(winCallback?:WinCallback, pauseCallback?:PauseCallback)=>void;
  pauseToggle:()=>void;
}

class Game implements IGame {
  private readonly char:Character;
  private readonly gameSettings:IGameSettings;
  private lastFrame = 0;
  private levels:Partial<Record<LevelId, Level>> = {}; // will a lot of levels cause a memory leak?
  private levelIdCurrent?:LevelId;
  private levelCurrent?:Level;
  private controls:Controls;
  private pause = false;
  private winCallback?:WinCallback;
  private pauseCallback?:PauseCallback;
  private totalElapsed = 0;

  private static RenderError = new Error("the game can't process without canvas");

  constructor(
    controlsSettings:IControlsSettings,
    gameSettings:IGameSettings,
    soundPlay:ISoundPlay,
  ) {
    GameSoundPlay.setSoundPlay(soundPlay);
    this.controls = new Controls(controlsSettings);
    this.char = new Character(this.controls);
    this.gameSettings = gameSettings;
  }

  public start(winCallback?:WinCallback, pauseCallback?:PauseCallback):void {
    this.levelCurrent = this.changeLevel({ levelId: LevelId.test, zone: 0, position: 0 }); // temp
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
    const levelCurrent = portal ? this.levelCurrent as Level : this.getLevel(load.levelId);
    if (!portal) this.levelIdCurrent = load.levelId;
    levelCurrent.load(this.char, load.zone, load.position, portal);
    return levelCurrent;
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

  private static timePad(value:number, padAmount = 2) {
    return `${value}`.padStart(padAmount, '0');
  }

  private static timeSpanToString(timeSpan:Date) {
    const h = Game.timePad(timeSpan.getUTCHours());
    const m = Game.timePad(timeSpan.getMinutes());
    const s = Game.timePad(timeSpan.getUTCSeconds());
    const ms = Game.timePad(timeSpan.getUTCMilliseconds(), 3);
    return `${h}:${m}:${s}.${ms}`;
  }

  private static drawTime(c:CanvasRenderingContext2D, fontSize:number, elapsedSeconds:number) {
    const cLocal = c;
    cLocal.font = `${fontSize}px serif`;
    cLocal.fillStyle = 'white';
    cLocal.fillText(Game.timeSpanToString(new Date(elapsedSeconds * 1000)), 5, fontSize * 2);
  }

  private processFrame(elapsed:number):boolean { // should be "EventType"
    const c = this.gameSettings.getRenderZone();
    if (!c) throw Game.RenderError;
    if (!this.levelCurrent) return false;
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
    if (this.gameSettings.TimeDisplay) Game.drawTime(c, Game.fontSize, this.totalElapsed);

    if (load) this.levelCurrent = this.changeLevel(load);
    return false;
  }

  private frame(frametime:number):void {
    if (this.controls.has(Action.pause, true)) this.pauseToggle();
    const elapsed = frametime - this.lastFrame;
    if (this.controls.has(Action.zoomUp, true)) this.gameSettings.Zoom += 1;
    if (this.controls.has(Action.zoomDown, true)) this.gameSettings.Zoom -= 1;
    if (!Number.isFinite(this.gameSettings.FrameTimeLimit)
    || elapsed >= this.gameSettings.FrameTimeLimit) {
      if (this.lastFrame && !this.pause && this.processFrame(elapsed)) {
        const elapsedSeconds = this.totalElapsed;
        if (this.winCallback) this.winCallback({ elapsedSeconds });
        return;
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
