import template from './index.html';
import style from './reg.scss';
import { View } from '..';
import { IUserService, UserData } from '../../services/apiServices/userServices';

class RegWindow extends View {
  services: IUserService;

  initRegWindow():void {
    const btnReg = this.getElementById('reg-user') as HTMLButtonElement;
    const skipReg = this.getElementById('reg-skip') as HTMLParagraphElement;
    const checkBox = this.getElementById('togglePassVisibilityReg') as HTMLInputElement;
    checkBox.addEventListener('input', () => this.togglePassVisibility(checkBox));
    skipReg.addEventListener('click', () => this.initStartButton());
    btnReg.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const data = this.makeUserData('reg');
      if (data.name === '' || data.password === '') {
        this.showContent('errorEmpty');
      } else {
        this.services.createUser(this.makeUserData('reg'))
          .then(() => {
            this.hiddenContent('errorMessage');
            this.hiddenContent('errorEmpty');
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
    const pass = this.getElementById('pass-reg') as HTMLInputElement;
    if (inputEl.checked === true) {
      pass.type = 'text';
    } else {
      pass.type = 'password';
    }
  }

  showContent(id: string) {
    (this.getElementById(`${id}`) as HTMLElement).style.display = 'flex';
  }

  hiddenContent(id: string) {
    (this.getElementById(`${id}`) as HTMLElement).style.display = 'none';
  }

  initStartButton() {
    (this.getElementById('startBtn') as HTMLButtonElement).style.display = 'flex';
  }

  constructor(parentId:string, services: IUserService) {
    super(parentId, template, style);
    this.services = services;
    this.initRegWindow();
  }
}

export default RegWindow;
