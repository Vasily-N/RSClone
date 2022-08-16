import Character from './character';
import Controls from './controls';

interface IGame {
  start:(context:CanvasRenderingContext2D)=>void;
}

class Game {
  private c?:CanvasRenderingContext2D;
  private char:Character = new Character();
  private controls:Controls = new Controls();

  public start(context:CanvasRenderingContext2D) {
    this.c = context;
    window.requestAnimationFrame(this.frame.bind(this));
  }

  private frame(frametime:number) {
    if (!this.c) return;
    this.char.frame(frametime);
    this.char.draw(this.c);
  }
}

export { Game, IGame };
