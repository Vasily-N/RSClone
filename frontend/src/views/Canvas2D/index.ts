import template from './index.html';
import style from './canvas.scss';
import { View } from '..';
import { IGame } from '../../game';

class Canvas2D extends View {
  private initContext():CanvasRenderingContext2D {
    const canvas = this.getElementById('canvas') as HTMLCanvasElement;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor(parentId:string, game:IGame) {
    super(parentId, template, style);
    game.start(this.initContext());
  }
}

export default Canvas2D;
