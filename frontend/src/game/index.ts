import Character from './character';
import Controls from './controls';

interface IGame {
  start:(context:CanvasRenderingContext2D)=>void;
}

class Game {
  private c?:CanvasRenderingContext2D;
  private char:Character = new Character();
  private controls:Controls = new Controls();
  private lastFrame = 0;

  public start(context:CanvasRenderingContext2D) {
    this.c = context;
    window.requestAnimationFrame(this.frame.bind(this));
  }

  private processFrame(c:CanvasRenderingContext2D, elapsed:number) {
    c.clearRect(0, 0, 500, 500); // temporal
    this.char.frame(elapsed);
    this.char.draw(c);
  }

  private frame(frametime:number) {
    if (!this.c) return;
    if (this.lastFrame) this.processFrame(this.c, frametime - this.lastFrame);
    this.lastFrame = frametime;
    window.requestAnimationFrame(this.frame.bind(this));
  }
}

export { Game, IGame };
