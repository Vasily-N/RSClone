import template from './registerWindow.html';
import style from './auth.scss';
import { View } from '..';
import { ApiServices } from '../../services';

export interface UserData {
  name: string,
  password: string,
}

class RegWindow extends View {
  private readonly regWin: HTMLDivElement;
  private readonly regBtn: HTMLButtonElement;
  services: ApiServices;

  private initRegWindow():HTMLDivElement {
    const reg = this.getElementById('reg') as HTMLDivElement;
    // this.regBtn.addEventListener('click', apiServices??);
    return reg;
  }

  private getUserData():UserData {
    const nameEl = this.getElementById('name-reg') as HTMLInputElement;
    const passEl = this.getElementById('pass-reg') as HTMLInputElement;
    return {
      name: nameEl.value,
      password: passEl.value,
    };
  }

  constructor(parentId:string, services: ApiServices) {
    super(parentId, template, style);
    this.services = services;
    this.regWin = this.initRegWindow();
    this.regBtn = this.getElementById('reg-user') as HTMLButtonElement;
  }
}

export default RegWindow;
