/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable no-new */
import bgImg from './background.jpg';
import logo from './logo.svg';
import style from './startPage.scss';
import { View } from '..';
import template from './index.html';
import { Services } from '../../services';
import SettingIsGame from '../settingIsGame';
import BoardersView from '../boarders';
import RegWindow from '../reg';
import AuthWindow from '../auth';

class StartPageView extends View {
  services: Services;
  mainPage: HTMLDivElement;
  imgSource: HTMLImageElement;
  svgSource: SVGElement;
  logoDiv: HTMLImageElement;
  regBtn: HTMLButtonElement;
  authBtn: HTMLButtonElement;
  modal: HTMLDivElement;
  modalContent: HTMLDivElement;
  closeBtn: HTMLSpanElement;

  initStartPage() {
    this.mainPage.style.backgroundImage = `url(${this.imgSource.src})`;
    this.logoDiv.src = `${this.svgSource}`;
    this.addListeners();
  }

  addListeners() {
    this.getElementById('startPage')?.addEventListener('click', (e: Event) => this.initPopup(e));
    this.closeBtn.addEventListener('click', () => this.closePopup());
  }

  initPopup(e: Event) {
    if (e.target === this.regBtn) {
      this.modal.style.display = 'flex';
      new RegWindow('modalContent', this.services.api.users).append();
    }
    if (e.target === this.getElementById('login')) {
      this.modal.style.display = 'flex';
      new AuthWindow('modalContent', this.services.api.users).append();
    }
    if (e.target === this.getElementById('toSettingGame')) {
      this.modal.style.display = 'flex';
      new SettingIsGame('modalContent', this.services.gameSettings).append();
    }
    if (e.target === this.getElementById('boarders')) {
      this.modal.style.display = 'flex';
      new BoardersView('modalContent', this.services.api.times).append();
    }
  }

  closePopup() {
    this.modalContent.innerHTML = '';
    this.modal.style.display = 'none';
  }

  constructor(parentId: string, services: Services) {
    super(parentId, template, style);
    this.services = services;
    this.mainPage = this.getElementById('startPage') as HTMLDivElement;
    this.logoDiv = this.getElementById('logo') as HTMLImageElement;
    this.regBtn = this.getElementById('registration') as HTMLButtonElement;
    this.authBtn = this.getElementById('login') as HTMLButtonElement;
    this.imgSource = new Image();
    this.imgSource.src = bgImg;
    this.svgSource = logo;
    this.modal = this.getElementById('modal') as HTMLDivElement;
    this.closeBtn = this.getElementById('close') as HTMLSpanElement;
    this.modalContent = this.getElementById('modalContent') as HTMLDivElement;
    this.initStartPage();
  }
}

export default StartPageView;
