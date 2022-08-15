import template from './index.html';
import style from './app.scss';
import { IView, View } from '..';
import Canvas2D from '../Canvas2D';
import Placeholder from '../Placeholder';
import ApiServices from '../../apiServices/apiServices';
import { Game } from '../../game';

enum ViewId { canvas, placaholder }

class AppPage extends View {
  private static contentId = style.content;
  private apiServices?:ApiServices; // TODO:
  private currentViewId?:ViewId;
  private views:Record<string, IView> = {};

  private createView(viewId:ViewId):IView {
    switch (viewId) {
      case ViewId.canvas: return new Canvas2D(AppPage.contentId, new Game()); // bad? tempotal?
      case ViewId.placaholder: return new Placeholder(AppPage.contentId, this.apiServices);
      default: throw new Error(`${viewId} doesn't exit`);
    }
  }

  private getView(viewId:ViewId):IView {
    if (!this.views[viewId]) this.views[viewId] = this.createView(viewId);
    return this.views[viewId];
  }

  constructor(parentId:string, services?:ApiServices) {
    super(parentId, template, style);
    this.apiServices = services;
  }

  private initListeners() {
    this.getElementById('toCanvas')?.addEventListener('click', this.changeTo.bind(this, ViewId.canvas));
    this.getElementById('toPlaceholder')?.addEventListener('click', this.changeTo.bind(this, ViewId.placaholder));
  }

  public append():void {
    super.append();
    this.initListeners();
    this.changeTo(ViewId.canvas);
  }

  private changeTo(viewId:ViewId):boolean {
    if (this.currentViewId === viewId) return false;
    this.currentViewId = viewId;
    const view = this.getView(viewId);
    view.replace();
    return true;
  }
}

export default AppPage;
