import template from './index.html';
import style from './auth.scss';
import { View } from '..';
import { ApiServices } from '../../services';

class RegWindow extends View {
  private readonly regWin: HTMLDivElement;
  services: ApiServices;

  private initRegWindow():HTMLDivElement {
    const reg = this.getElementById('reg') as HTMLDivElement;
    return reg;
  }

  constructor(parentId:string, services: ApiServices) {
    super(parentId, template, style);
    this.services = services;
    this.regWin = this.initRegWindow();
  }
}

export default RegWindow;
