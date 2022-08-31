import bgImg from './background.jpg';
import logo from './logo.svg';
import style from './startPage.scss';
import { View } from '..';
import template from './index.html';

class StartPageView extends View {
  mainPage: HTMLDivElement;
  imgSource: HTMLImageElement;
  svgSource: string;
  logoDiv: HTMLAnchorElement;

  initStartPage() {
    this.mainPage.style.backgroundImage = `url(${this.imgSource.src})`;
  }

  constructor(parentId: string) {
    super(parentId, template, style);
    this.mainPage = this.getElementById('startPage') as HTMLDivElement;
    this.logoDiv = this.getElementById('rsLogo') as HTMLAnchorElement;
    this.imgSource = new Image();
    this.imgSource.src = bgImg;
    this.svgSource = logo;
    this.initStartPage();
  }
}

export default StartPageView;
