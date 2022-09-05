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
    const checkBox = this.getElementById('togglePassVisibility') as HTMLInputElement;
    checkBox.addEventListener('input', () => this.togglePassVisibility(checkBox));
    skipAuth.addEventListener('click', () => this.initStartButton());
    btnAuth.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const data = this.makeUserData('auth');
      if (data.name === '' || data.password === '') {
        this.showContent('errorEmpty');
      } else {
        this.services.updateUser(this.makeUserData('auth'))
          .then(() => {
            this.hiddenContent('errorEmpty');
            this.hiddenContent('errorMessage');
            return this.initStartButton();
          })
          .catch(() => this.showContent('errorMessage'));
      }
    });
  }

  makeUserData(suffix: string):UserData {
    const nameEl = this.getElementById(`name-${suffix}`) as HTMLInputElement;
    const passEl = this.getElementById(`pass-${suffix}`) as HTMLInputElement;
    localStorage.setItem('username', nameEl.value.trim());
    return {
      name: nameEl.value.trim(),
      password: passEl.value.trim(),
    };
  }

  togglePassVisibility(inputEl: HTMLInputElement) {
    const pass = this.getElementById('pass-auth') as HTMLInputElement;
    if (inputEl.checked === true) {
      pass.type = 'text';
    } else {
      pass.type = 'password';
    }
  }

  hiddenContent(id: string) {
    (this.getElementById(`${id}`) as HTMLElement).style.display = 'none';
  }

  initStartButton() {
    (this.getElementById('startBtn') as HTMLButtonElement).style.display = 'flex';
  }

  showContent(id: string) {
    (this.getElementById(`${id}`) as HTMLElement).style.display = 'flex';
  }

  constructor(parentId:string, services: IUserService) {
    super(parentId, template, style);
    this.services = services;
    this.initAuthWindow();
  }
}

export default AuthWindow;
