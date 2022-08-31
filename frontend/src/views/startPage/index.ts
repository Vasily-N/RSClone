import bgImg from './background.jpg';
import logo from './logo.svg';
import style from './startPage.scss';
import { View } from '..';
import template from './index.html';

class StartPageView extends View {
  mainPage: HTMLDivElement;
  imgSource: HTMLImageElement;
  svgSource: SVGElement;
  logoDiv: HTMLImageElement;

  initStartPage() {
    this.mainPage.style.backgroundImage = `url(${this.imgSource.src})`;
    this.logoDiv.src = `${this.svgSource}`;
  }

  constructor(parentId: string) {
    super(parentId, template, style);
    this.mainPage = this.getElementById('startPage') as HTMLDivElement;
    this.logoDiv = this.getElementById('logo') as HTMLImageElement;
    this.imgSource = new Image();
    this.imgSource.src = bgImg;
    this.svgSource = logo;
    this.initStartPage();
  }
}

export default StartPageView;
