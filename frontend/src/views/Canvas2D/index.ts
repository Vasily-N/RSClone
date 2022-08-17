import template from './index.html';
import style from './canvas.scss';
import { View } from '..';
import { IGame } from '../../game';

class Canvas2D extends View {
  private readonly bg:HTMLDivElement;

  private initContext():CanvasRenderingContext2D {
    const canvas = this.getElementById('canvas') as HTMLCanvasElement;
    canvas.addEventListener('mousemove', this.showCoords.bind(this));
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor(parentId:string, game:IGame) {
    super(parentId, template, style);
    this.bg = this.getElementById('bg') as HTMLDivElement;
    game.start(this.initContext());
  }

  private showCoords(event:MouseEvent) {
    const canvasRect:DOMRect = (event.target as Element).getBoundingClientRect();
    this.bg.innerHTML = `x: ${(event.x - canvasRect.x).toString().padStart(4, '0')}, y:${(event.y - canvasRect.y).toString().padStart(4, '0')}`;
  }
}

export default Canvas2D;
