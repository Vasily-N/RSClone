import template from './index.html';
import style from './reg.scss';
import { View } from '..';
import { IUserService, UserData } from '../../services/apiServices/userServices';

class RegWindow extends View {
  services: IUserService;

  initRegWindow():void {
    const btnReg = this.getElementById('reg-user') as HTMLButtonElement;
    const skipReg = this.getElementById('reg-skip') as HTMLParagraphElement;
    btnReg.addEventListener('click', () => this.services.createUser(this.makeUserData('reg')));
  }

  makeUserData(suffix: string):UserData {
    const nameEl = this.getElementById(`name-${suffix}`) as HTMLInputElement;
    const passEl = this.getElementById(`pass-${suffix}`) as HTMLInputElement;
    return {
      name: nameEl.value,
      password: passEl.value,
    };
  }

  constructor(parentId:string, services: IUserService) {
    super(parentId, template, style);
    this.services = services;
    this.initRegWindow();
  }
}

export default RegWindow;
