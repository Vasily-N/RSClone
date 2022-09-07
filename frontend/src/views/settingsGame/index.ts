import template from './index.html';
import style from './settings-game.scss';
import { View } from '..';
import { IGameSettings } from '../../services';

type UISettings = {
  displayFps:HTMLInputElement
  displayTimer:HTMLInputElement
  displayHitboxes:HTMLInputElement
  displayCollisions:HTMLInputElement
  zoom:HTMLInputElement
  fpsLimit:HTMLInputElement
  fpsLimitEnabled:HTMLInputElement
};

class SettingsGame extends View {
  private gameSettings:IGameSettings;
  private ui:UISettings;

  private initUI():UISettings {
    const displayHitboxes = this.getElementById('display-hitboxes') as HTMLInputElement;
    displayHitboxes.addEventListener('click', () => { this.gameSettings.DrawBoxes = displayHitboxes.checked; });

    const displayFps = this.getElementById('display-fps') as HTMLInputElement;
    displayFps.addEventListener('click', () => { this.gameSettings.FpsDisplay = displayFps.checked; });

    const displayTimer = this.getElementById('display-timer') as HTMLInputElement;
    displayTimer.addEventListener('click', () => { this.gameSettings.TimeDisplay = displayTimer.checked; });

    const displayCollisions = this.getElementById('display-collisions') as HTMLInputElement;
    displayCollisions.addEventListener('click', () => { this.gameSettings.DrawSurfaces = displayCollisions.checked; });

    const fpsLimitEnabled = this.getElementById('fps-limit-checkbox') as HTMLInputElement;
    fpsLimitEnabled.addEventListener('click', this.setFpsLimit.bind(this));

    const fpsLimit = this.getElementById('fps-limit-value') as HTMLInputElement;
    fpsLimit.value = '60';
    fpsLimit.addEventListener('change', this.setFpsLimit.bind(this));

    const zoom = this.getElementById('zoom') as HTMLInputElement;
    zoom.addEventListener('change', () => { this.gameSettings.Zoom = +zoom.value; });

    return {
      displayFps, displayTimer, displayHitboxes, displayCollisions, fpsLimit, fpsLimitEnabled, zoom,
    };
  }

  private setFpsLimit() {
    this.gameSettings.FpsLimit = +(this.ui.fpsLimitEnabled.checked && this.ui.fpsLimit.value);
  }

  constructor(parentId: string, gameSettings: IGameSettings) {
    super(parentId, template, style);
    this.gameSettings = gameSettings;
    this.ui = this.initUI();
    this.updateValues();
  }

  private updateValues() {
    this.ui.displayFps.checked = this.gameSettings.FpsDisplay;
    this.ui.displayHitboxes.checked = this.gameSettings.DrawBoxes;
    this.ui.displayTimer.checked = this.gameSettings.TimeDisplay;
    this.ui.displayCollisions.checked = this.gameSettings.DrawSurfaces;
    this.ui.fpsLimitEnabled.checked = !!this.gameSettings.FpsLimit;
    this.ui.fpsLimit.min = String(this.gameSettings.FpsLimitMin);
    if (this.gameSettings.FpsLimit) this.ui.fpsLimit.value = String(this.gameSettings.FpsLimit);
    this.ui.zoom.min = String(this.gameSettings.ZoomMin);
    this.ui.zoom.max = String(this.gameSettings.ZoomMax);
    this.ui.zoom.value = String(this.gameSettings.Zoom);
  }

  public replace():void {
    super.replace();
    this.updateValues();
  }
}

export default SettingsGame;
