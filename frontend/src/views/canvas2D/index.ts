import template from './index.html';
import style from './canvas.scss';
import { View } from '..';
import { IGameSettings } from '../../services';

class Canvas2D extends View {
  private readonly bg:HTMLDivElement;
  private readonly canvas:HTMLCanvasElement;
  private readonly gameSettings:IGameSettings;

  private initCanvas():HTMLCanvasElement {
    const canvas = this.getElementById('canvas') as HTMLCanvasElement;
    canvas.addEventListener('mousemove', this.showCoords.bind(this));
    canvas.addEventListener('mouseout', this.removeCoords.bind(this));
    canvas.addEventListener('mouseout', this.removeCoords.bind(this));
    canvas.addEventListener('wheel', this.changeZoom.bind(this));
    return canvas;
  }

  constructor(parentId:string, gameSettings:IGameSettings) {
    super(parentId, template, style);
    this.bg = this.getElementById('bg') as HTMLDivElement;
    this.gameSettings = gameSettings;

    this.canvas = this.initCanvas();
    this.gameSettings.setRenderZone(this.canvas.getContext('2d'));
    const setCanvasSize = this.setCanvasSize.bind(this);

    // to process it after canvas was rendered
    setTimeout(setCanvasSize);
    // hack to fight the developer console not firing the resize event
    setInterval(setCanvasSize, 500);
  }

  private showCoords(event:MouseEvent) {
    const canvasRect:DOMRect = (event.target as Element).getBoundingClientRect();
    this.bg.innerHTML = `x: ${(event.x - canvasRect.x).toString().padStart(4, '0')}, y:${(event.y - canvasRect.y).toString().padStart(4, '0')}`;
  }

  private removeCoords() {
    this.bg.innerHTML = '\xa0';
  }

  private previousWindowWidth = 0;
  private previousWindowHeight = 0;
  private setCanvasSize() {
    if (this.previousWindowWidth === window.innerWidth
      && this.previousWindowHeight === window.innerHeight) {
      return;
    }

    this.previousWindowWidth = window.innerWidth;
    this.previousWindowHeight = window.innerHeight;

    this.canvas.style.width = '100%';
    const outsidePadding = window.innerWidth - this.canvas.clientWidth;
    const canvasTop = this.canvas.getBoundingClientRect().top;
    const width = Math.floor(window.innerWidth - outsidePadding);
    const height = Math.floor(window.innerHeight - canvasTop - outsidePadding);

    this.gameSettings.RenderSizeSet({ width, height });
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width}px`;
  }

  private changeZoom(event:WheelEvent) {
    this.gameSettings.Zoom += event.deltaY < 0 ? 1 : -1;
    this.setCanvasSize();
  }
}

export default Canvas2D;
