/* eslint-disable no-new */
import bgImg from './background.jpg';
import logo from './logo.svg';
import style from './startPage.scss';
import { View, IView } from '..';
import template from './index.html';
import { Services } from '../../services';
import { Game } from '../../game';
import SettingIsGame from '../settingIsGame';

class StartPageView extends View {
  services: Services;
  mainPage: HTMLDivElement;
  imgSource: HTMLImageElement;
  svgSource: SVGElement;
  logoDiv: HTMLImageElement;
  regBtn: HTMLButtonElement;
  authBtn: HTMLButtonElement;
  modal: HTMLDivElement;
  closeBtn: HTMLSpanElement;
  private static contentId = style.content;
  private views: Record<string, IView> = {};
  private game?: Game;

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
      this.modal.children[1].innerHTML = 'its registration';
    }
    if (e.target === this.getElementById('login')) {
      this.modal.style.display = 'flex';
      this.modal.children[1].innerHTML = 'its login';
    }
    if (e.target === this.getElementById('toSettingGame')) {
      this.modal.style.display = 'flex';
      this.modal.children[1].innerHTML = 'its settings';
    }
    if (e.target === this.getElementById('boarders')) {
      this.modal.style.display = 'flex';
      this.modal.children[1].innerHTML = 'its boarders';
    }
  }

  closePopup() {
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
    this.initStartPage();
  }
}

export default StartPageView;
