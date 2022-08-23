/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import App from '../app';
import { registerWindow, authWindow } from './panels';

interface IForm {
  name: string,
  password: string,
}

class AuthWindow {
  userDataReg: IForm = {
    name: 'default',
    password: 'default',
  };

  start() {
    document.body.innerHTML = registerWindow();
    (document.getElementById('reg-user') as HTMLButtonElement).addEventListener('click', () => this.regUser());
    (document.getElementById('reg-message') as HTMLParagraphElement).addEventListener('click', () => this.showAuthPanel());
    const regPanel = document.getElementById('reg');
    (document.getElementById('reg-skip-1') as HTMLParagraphElement).addEventListener('click', () => this.hiddenPanel(regPanel));
  }

  makeData(isReg: boolean) {
    if (isReg === true) {
      this.userDataReg = {
        name: (document.getElementById('user-reg') as HTMLInputElement).value,
        password: (document.getElementById('password-reg') as HTMLInputElement).value,
      };
    } else {
      this.userDataReg = {
        name: (document.getElementById('user-auth') as HTMLInputElement).value,
        password: (document.getElementById('password-auth') as HTMLInputElement).value,
      };
    }
    return this.userDataReg;
  }

  async postData(user: IForm) {
    try {
      const req = await fetch('http://127.0.0.1:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const res = await req.json().then(() => this.hiddenPanel(document.getElementById('reg')));
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async getData() {
    try {
      const req = await fetch('http://127.0.0.1:5000/api/users');
      const res = await req.json();
      console.log(res);
      this.makeData(false);
      for (let i = 0; i < res.length; i += 1) {
        if (res[i].name === this.userDataReg.name
          && res[i].password === this.userDataReg.password) {
          console.log(res[i]);
          console.log(`glad to see you again, ${this.userDataReg.name}`);
          return this.hiddenPanel(document.getElementById('auth'));
        }
      }
      console.log('you entered the wrong username or password');
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  regUser() {
    this.postData(this.makeData(true));
  }

  showAuthPanel() {
    (document.getElementById('reg') as HTMLDivElement).style.display = 'none';
    document.body.innerHTML = authWindow();
    (document.getElementById('auth-user') as HTMLButtonElement).addEventListener('click', () => this.getData());
    const panel = document.getElementById('auth');
    (document.getElementById('reg-skip-2') as HTMLParagraphElement).addEventListener('click', () => this.hiddenPanel(panel));
  }

  hiddenPanel(panel: HTMLElement | null) {
    if (panel) {
      panel.style.display = 'none';
    }
    new App().start();
  }
}

export default AuthWindow;
