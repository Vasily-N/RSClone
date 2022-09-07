/* eslint-disable max-len */
/* eslint-disable no-new */
import style from './menu.scss';
import { View } from '..';
import template from './index.html';
import { Services } from '../../services';
import SettingIsGame from '../settingIsGame';
import BoardersView from '../boarders';
import RegWindow from '../reg';
import AuthWindow from '../auth';
import Canvas2D from '../canvas2D';
import { Game } from '../../game';

class MenuView extends View {
  services: Services;
  regBtn: HTMLButtonElement;
  authBtn: HTMLButtonElement;
  modal: HTMLDivElement;
  modalContent: HTMLDivElement;
  closeBtn: HTMLSpanElement;
  game?: Game;

  initMenu() {
    this.addListeners();
  }

  addListeners() {
    // this.getElementById('startPage')?.addEventListener('click', (e: Event) => this.initPopup(e));
    this.getElementById('close')?.addEventListener('click', () => this.closePopup());
  }

  initPopup(e: Event) {
    if (e.target === this.regBtn) {
      this.showPopup();
      new RegWindow('modalContent', this.services.api.users).append();
      this.continueGame();
    }
    if (e.target === this.getElementById('login')) {
      this.showPopup();
      new AuthWindow('modalContent', this.services.api.users).append();
      this.continueGame();
    }
    if (e.target === this.getElementById('toSettingGame')) {
      this.showPopup();
      new SettingIsGame('modalContent', this.services.gameSettings).append();
    }
    if (e.target === this.getElementById('boarders')) {
      this.showPopup();
      new BoardersView('modalContent', this.services.api).append();
    }
  }

  showPopup() {
    this.modal.style.display = 'flex';
  }

  closePopup() {
    this.modalContent.innerHTML = '';
    this.modal.style.display = 'none';
  }

  continueGame() {
    this.getElementById('startBtn')?.addEventListener('click', () => {
      (this.getElementById('startPage') as HTMLDivElement).style.display = 'none';
      this.modal.style.display = 'none';
      const canvasView = new Canvas2D('main', this.services.gameSettings).append();
      this.game = new Game(
        this.services.controls.settings,
        this.services.gameSettings,
        this.services.sounds.play,
      );
      this.game.start();
      return canvasView;
    });
  }

  constructor(parentId: string, services: Services) {
    super(parentId, template, style);
    this.services = services;
    this.regBtn = this.getElementById('registration') as HTMLButtonElement;
    this.authBtn = this.getElementById('login') as HTMLButtonElement;
    this.modal = this.getElementById('modal') as HTMLDivElement;
    this.closeBtn = this.getElementById('close') as HTMLSpanElement;
    this.modalContent = this.getElementById('modalContent') as HTMLDivElement;
    this.initMenu();
  }
}

export default MenuView;
