import bgImg from './background.jpg';
import style from './startPage.scss';
import { View } from '..';
import template from './index.html';
import { Services } from '../../services';

class StartPageView extends View {
  services: Services;
  mainPage: HTMLDivElement;
  imgSource: HTMLImageElement;

  initStartPage() {
    this.mainPage.style.backgroundImage = `url(${this.imgSource.src})`;
  }

  constructor(parentId: string, services: Services) {
    super(parentId, template, style);
    this.services = services;
    this.mainPage = this.getElementById('startPage') as HTMLDivElement;
    this.imgSource = new Image();
    this.imgSource.src = bgImg;
    this.initStartPage();
  }
}

export default StartPageView;
