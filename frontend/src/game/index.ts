import Character from './character';
import Controls from './controls';
import IControlsSettings from './controls/iControlsSettings.interface';
import CanvasHelper from './types/canvasHelper';
import Point from './types/Point';

interface IGame {
  start:(context:CanvasRenderingContext2D)=>void;
}

class Game {
  private c:CanvasHelper;
  private readonly char:Character;
  private lastFrame = 0;
  private static readonly drawBoxes = true; // Temporal
  private static readonly displayFps = true; // Temporal

  private readonly controls:Controls;

  constructor(controlsSettings:IControlsSettings, c:CanvasHelper) {
    this.controls = new Controls(controlsSettings);
    this.char = new Character(new Point(100, 100), this.controls);
    this.c = c;
    this.c.c.font = '48px serif';
    this.c.c.fillStyle = 'white';
    this.requestNextFrame();
  }

  private requestNextFrame() {
    window.requestAnimationFrame(this.frame.bind(this));
  }

  private processFrame(elapsed:number):void {
    const { c, size } = this.c;
    c.clearRect(0, 0, size.X, size.Y); // temporal
    this.char.frame(elapsed / 1000);
    this.char.draw(c, Game.drawBoxes);

    if (Game.displayFps) c.fillText(`FPS: ${(1000 / elapsed).toFixed(1)}`, 5, 10);
  }

  private frame(frametime:number):void {
    if (this.lastFrame) this.processFrame(frametime - this.lastFrame);
    this.lastFrame = frametime;
    this.requestNextFrame();
  }
}

export { Game, IGame };
