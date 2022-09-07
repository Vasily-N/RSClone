import template from './index.html';
import style from './app.scss';
import { IView, View } from '..';

import Canvas2D from '../canvas2D';
import {
  Game, IGame, IGameCallbacks, WinTheGame,
} from '../../game';
import BoardersView from '../boarders';
import SoundView from '../sound';

import { Services } from '../../services';
import SettingsGame from '../settingsGame';
import StartPageView from '../startPage';
import ControlsView from '../settingControl/ControlsView';
import SettingSound from '../settingSound';
import RegWindow from '../reg';
import AuthWindow from '../auth';
import Logo from './logo.svg';

enum ViewId {
  startPage, reg, auth, canvas, placeholder, sounds, settingsGame, settingControl, settingSound,
}

class AppPage extends View implements IGameCallbacks {
  private static contentId = style.content;
  private services: Services;
  private currentViewId?: ViewId;
  private views: Record<string, IView> = {};
  private game?: IGame;

  private createView(viewId: ViewId): IView {
    switch (viewId) {
      case ViewId.startPage: return new StartPageView(AppPage.contentId, this.services);
      case ViewId.reg: return new RegWindow(AppPage.contentId, this.services.api.users);
      case ViewId.auth: return new AuthWindow(AppPage.contentId, this.services.api.users);
      case ViewId.canvas: {
        const canvasView = new Canvas2D(AppPage.contentId, this.services.gameSettings);
        this.game = new Game(
          this.services.controls.settings,
          this.services.gameSettings,
          this.services.sounds.play,
        );
        this.game.start(this);
        return canvasView;
      }

      case ViewId.placeholder: return new BoardersView(AppPage.contentId, this.services.api);
      case ViewId.sounds: return new SoundView('sounds', this.services.sounds.subsribe);
      case ViewId.settingsGame:
        return new SettingsGame(AppPage.contentId, this.services.gameSettings);
      case ViewId.settingControl: {
        return new ControlsView(AppPage.contentId, this.services.controls.settings);
      }
      case ViewId.settingSound: {
        return new SettingSound(AppPage.contentId, this.services.sounds.settings);
      }
      default: throw new Error(`${viewId} doesn't exit`);
    }
  }

  private getView(viewId: ViewId): IView {
    if (!this.views[viewId]) this.views[viewId] = this.createView(viewId);
    return this.views[viewId];
  }

  constructor(parentId: string, services: Services) {
    super(parentId, template, style);
    this.services = services;
  }

  private initListeners() {
    this.getElementById('toMainPage')?.addEventListener('click', this.changeTo.bind(this, ViewId.startPage));
    this.getElementById('toCanvas')?.addEventListener('click', () => this.changeToCanvas());
    this.getElementById('login')?.addEventListener('click', (e) => {
      this.changeToAuthReg(e);
    });
    this.getElementById('registration')?.addEventListener('click', (e) => {
      this.changeToAuthReg(e);
    });
    this.getElementById('toPlaceholder')?.addEventListener('click', (e) => {
      this.changeToSettingsOrBorders(e);
    });
    this.getElementById('toSettingGame')?.addEventListener('click', (e) => {
      this.changeToSettingsOrBorders(e);
    });
    this.getElementById('toSettingControl')?.addEventListener('click', (e) => {
      this.changeToSettingsOrBorders(e);
    });
    this.getElementById('settingSound')?.addEventListener('click', (e) => {
      this.changeToSettingsOrBorders(e);
    });
  }

  changeToCanvas() {
    this.navigateHidden();
    this.changeTo(ViewId.canvas);
    this.closePopup();
  }

  changeToSettingsOrBorders(e: Event) {
    if (e.target === this.getElementById('toPlaceholder')) {
      this.showPopup();
      new BoardersView('modalContent', this.services.api).append();
    }
    if (e.target === this.getElementById('toSettingGame')) {
      this.showPopup();
      new SettingsGame('modalContent', this.services.gameSettings).append();
    }
    if (e.target === this.getElementById('toSettingControl')) {
      this.showPopup();
      new ControlsView('modalContent', this.services.controls.settings).append();
    }
    if (e.target === this.getElementById('settingSound')) {
      this.showPopup();
      new SettingSound('modalContent', this.services.sounds.settings).append();
    }
  }

  changeToAuthReg(e: Event) {
    if (e.target === this.getElementById('login')) {
      this.showPopup();
      new AuthWindow('modalContent', this.services.api.users).append();
      (this.getElementById('startBtn') as HTMLButtonElement).addEventListener('click', () => this.changeToCanvas());
    }
    if (e.target === this.getElementById('registration')) {
      this.showPopup();
      new RegWindow('modalContent', this.services.api.users).append();
      (this.getElementById('startBtn') as HTMLButtonElement).addEventListener('click', () => this.changeToCanvas());
    }
  }

  showPopup() {
    (this.getElementById('modal') as HTMLDivElement).style.display = 'flex';
    (this.getElementById('close') as HTMLSpanElement).addEventListener('click', () => this.closePopup());
  }

  closePopup() {
    (this.getElementById('modalContent') as HTMLDivElement).innerHTML = '';
    (this.getElementById('modal') as HTMLDivElement).style.display = 'none';
  }

  navigateHidden() {
    (this.getElementById('navigation') as HTMLElement).style.display = 'none';
  }

  navigateShow() {
    (this.getElementById('navigation') as HTMLElement).style.display = 'flex';
  }

  public append(): void {
    super.append();
    this.initListeners();
    this.getView(ViewId.sounds).append();
    this.changeTo(ViewId.startPage);
    (this.getElementById('logo') as HTMLImageElement).src = `${Logo}`;
  }

  private changeTo(viewId: ViewId): boolean {
    if (this.currentViewId === viewId) return false;
    if (viewId !== ViewId.startPage) {
      (this.getElementById('login') as HTMLButtonElement).style.display = 'none';
      (this.getElementById('registration') as HTMLButtonElement).style.display = 'none';
      (this.getElementById('toCanvas') as HTMLButtonElement).style.display = 'none';
      (this.getElementById('toMainPage') as HTMLButtonElement).style.display = 'flex';
    } else {
      (this.getElementById('login') as HTMLButtonElement).style.display = 'flex';
      (this.getElementById('registration') as HTMLButtonElement).style.display = 'flex';
      (this.getElementById('toMainPage') as HTMLButtonElement).style.display = 'none';
      (this.getElementById('toCanvas') as HTMLButtonElement).style.display = 'none';
    }
    this.currentViewId = viewId;
    const view = this.getView(viewId);
    if (viewId === ViewId.canvas && this.game) this.game.pause = false;
    view.replace();
    return true;
  }

  public winTheGame(win:WinTheGame):void {
    new BoardersView(AppPage.contentId, this.services.api)
      .postTimeData(+win.elapsedSeconds.toFixed(3));
    new BoardersView(AppPage.contentId, this.services.api).postWinData();
  }

  public pauseTheGame():void {
    if (this.game?.pause === true) {
      this.navigateShow();
    } else {
      this.navigateHidden();
    }
  }

  public characterHp(hp:number) {
    alert(hp);
    console.log(this);
  }
}

export default AppPage;
