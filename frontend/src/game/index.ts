import Character from './character';
import { IControlsSettings, Controls, ControlsAction as Action } from './services/controls';

import { IGameSettings } from './services/settings';
import { LevelId, LevelLoad } from './levels/types';
import Level from './levels';
import levelList from './levels/list';

interface IGame {
  start:(context:CanvasRenderingContext2D)=>void;
}

class Game {
  private readonly char:Character;
  private readonly gameSettings:IGameSettings;
  private lastFrame = 0;
  private levels:Partial<Record<LevelId, Level>> = {}; // will a lot of levels cause a memory leak?
  private levelIdCurrent?:LevelId;
  private levelCurrent:Level;
  private controls:Controls;

  constructor(controlsSettings:IControlsSettings, gameSettings:IGameSettings) {
    this.controls = new Controls(controlsSettings);
    this.char = new Character(this.controls);
    this.gameSettings = gameSettings;
    this.gameSettings.RenderZone.imageSmoothingEnabled = false;
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

  private static fontSize = 24;
  private static drawFps(c:CanvasRenderingContext2D, fontSize:number, elapsedMs:number) {
    const cLocal = c;
    cLocal.font = `${fontSize}px serif`;
    cLocal.fillStyle = 'white';
    cLocal.fillText(`FPS: ${(1000 / elapsedMs).toFixed(1)}`, 5, fontSize);
  }

  private processFrame(elapsed:number):void {
    const { RenderZone: c, RenderSize: size, Zoom: zoom } = this.gameSettings;

    const load = this.levelCurrent.frame(elapsed / 1000, size, zoom);
    if (load) this.changeLevel(load);

    c.clearRect(0, 0, size.X, size.Y);
    this.levelCurrent.draw(c, this.gameSettings.DrawBoxes, this.gameSettings.DrawSurfaces);

    if (this.gameSettings.FpsDisplay) Game.drawFps(c, Game.fontSize / zoom, elapsed);
  }

  private frame(frametime:number):void {
    const elapsed = frametime - this.lastFrame;
    if (this.controls.has(Action.zoomUp, true)) this.gameSettings.Zoom += 1;
    if (this.controls.has(Action.zoomDown, true)) this.gameSettings.Zoom -= 1;
    if (!Number.isFinite(this.gameSettings.FrameTimeLimit)
    || elapsed > this.gameSettings.FrameTimeLimit) {
      if (this.lastFrame) this.processFrame(elapsed);
      this.lastFrame = frametime;
    }
    this.requestNextFrame();
  }
}

export { Game, IGame };
