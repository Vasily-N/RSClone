import template from './index.html';
import style from './canvas.scss';
import { View } from '..';
import { Point } from '../../shapes';

class Canvas2D extends View {
  private readonly bg:HTMLDivElement;
  private readonly c:CanvasRenderingContext2D;
  public get Context():CanvasRenderingContext2D { return this.c; }

  private initCanvas(size:Point):CanvasRenderingContext2D {
    const canvas = this.getElementById('canvas') as HTMLCanvasElement;
    canvas.addEventListener('mousemove', this.showCoords.bind(this));
    canvas.width = size.X;
    canvas.height = size.Y;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor(parentId:string, size:Point) {
    super(parentId, template, style);
    this.bg = this.getElementById('bg') as HTMLDivElement;
    this.c = this.initCanvas(size);
    this.c.imageSmoothingEnabled = false;
  }

  private showCoords(event:MouseEvent) {
    const canvasRect:DOMRect = (event.target as Element).getBoundingClientRect();
    this.bg.innerHTML = `x: ${(event.x - canvasRect.x).toString().padStart(4, '0')}, y:${(event.y - canvasRect.y).toString().padStart(4, '0')}`;
  }
}

export default Canvas2D;
