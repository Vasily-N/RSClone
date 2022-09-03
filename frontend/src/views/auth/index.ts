/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import template from './index.html';
import style from './auth.scss';
import { View } from '..';
import { IUserService, UserData } from '../../services/apiServices/userServices';

class AuthWindow extends View {
  services: IUserService;

  initAuthWindow():void {
    const btnAuth = this.getElementById('auth-user') as HTMLButtonElement;
    const skipAuth = this.getElementById('auth-skip') as HTMLParagraphElement;
    btnAuth.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.services.updateUser(this.makeUserData('auth'));
    });
  }

  makeUserData(suffix: string):UserData {
    const nameEl = this.getElementById(`name-${suffix}`) as HTMLInputElement;
    const passEl = this.getElementById(`pass-${suffix}`) as HTMLInputElement;
    return {
      name: nameEl.value.trim(),
      password: passEl.value.trim(),
    };
  }

  constructor(parentId:string, services: IUserService) {
    super(parentId, template, style);
    this.services = services;
    this.initAuthWindow();
  }
}

export default AuthWindow;
