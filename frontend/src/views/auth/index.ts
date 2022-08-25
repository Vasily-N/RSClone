import template from './registerWindow.html';
import style from './auth.scss';
import { View } from '..';
import { IUserSrvice, UserData } from '../../services/apiServices/userServices';

class RegWindow extends View {
  mainWin: HTMLDivElement;
  services: IUserSrvice;

  initRegWindow():void {
    const regWin = this.getElementById('reg') as HTMLDivElement;
    const loginWin = this.getElementById('auth') as HTMLDivElement;
    RegWindow.hiddenElem(loginWin);
    const btn = this.getElementById('reg-btn') as HTMLButtonElement;
    const isAccaunt = this.getElementById('reg-message') as HTMLParagraphElement;
    const skip = this.getElementById('reg-skip') as HTMLParagraphElement;
    btn.addEventListener('click', () => this.services.createUser(this.makeUserData('reg')));
    isAccaunt.addEventListener('click', () => this.hiddenAndShow(regWin, loginWin));
    skip.addEventListener('click', () => RegWindow.hiddenElem(this.mainWin));
  }

  makeUserData(suffix: string):UserData {
    const nameEl = this.getElementById(`name-${suffix}`) as HTMLInputElement;
    const passEl = this.getElementById(`pass-${suffix}`) as HTMLInputElement;
    return {
      name: nameEl.value,
      password: passEl.value,
    };
  }

  static hiddenElem(elem: HTMLDivElement) {
    elem.remove();
  }

  showElem(elem: HTMLDivElement) {
    this.mainWin.append(elem);
  }

  hiddenAndShow(hidden: HTMLDivElement, show: HTMLDivElement) {
    RegWindow.hiddenElem(hidden);
    this.showElem(show);
  }

  constructor(parentId:string, services: IUserSrvice) {
    super(parentId, template, style);
    this.mainWin = this.getElementById('auth-window') as HTMLDivElement;
    this.services = services;
    this.initRegWindow();
  }
}

export default RegWindow;
