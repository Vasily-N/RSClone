import template from './index.html';
import style from './settings-game.scss';
import { View } from '..';
import { IGameSettings } from '../../services';

enum FpsLimit {
  value,
  enabled,
}

class SettingsGame extends View {
  private gameSettings:IGameSettings;
  private fpsLimit:Record<FpsLimit, HTMLInputElement>;

  private initSetting():Record<FpsLimit, HTMLInputElement> {
    const displayHitboxes = this.getElementById('display-hitboxes') as HTMLInputElement;
    displayHitboxes.checked = this.gameSettings.DrawBoxes;
    displayHitboxes.addEventListener('click', () => { this.gameSettings.DrawBoxes = displayHitboxes.checked; });

    const displayFps = this.getElementById('display-fps') as HTMLInputElement;
    displayFps.checked = this.gameSettings.FpsDisplay;
    displayFps.addEventListener('click', () => { this.gameSettings.FpsDisplay = displayFps.checked; });

    const displayTimer = this.getElementById('display-timer') as HTMLInputElement;
    displayTimer.checked = this.gameSettings.TimeDisplay;
    displayTimer.addEventListener('click', () => { this.gameSettings.TimeDisplay = displayTimer.checked; });

    const drawSurfaces = this.getElementById('display-collisions') as HTMLInputElement;
    drawSurfaces.checked = this.gameSettings.DrawSurfaces;
    drawSurfaces.addEventListener('click', () => { this.gameSettings.DrawSurfaces = drawSurfaces.checked; });

    const fpsLimitCheckbox = this.getElementById('fps-limit-checkbox') as HTMLInputElement;
    fpsLimitCheckbox.checked = this.gameSettings.FpsLimit > 0;
    fpsLimitCheckbox.addEventListener('click', this.setFpsLimit.bind(this));

    const fpsLimit = this.getElementById('fps-limit-value') as HTMLInputElement;
    fpsLimit.min = String(this.gameSettings.FpsLimitMin);
    fpsLimit.value = '60';
    fpsLimit.addEventListener('change', this.setFpsLimit.bind(this));

    const zoomGame = this.getElementById('zoom') as HTMLInputElement;
    zoomGame.min = String(this.gameSettings.ZoomMin);
    zoomGame.max = String(this.gameSettings.ZoomMax);
    zoomGame.value = String(this.gameSettings.Zoom);
    zoomGame.addEventListener('change', () => { this.gameSettings.Zoom = +zoomGame.value; });

    return {
      [FpsLimit.value]: fpsLimit,
      [FpsLimit.enabled]: fpsLimitCheckbox,
    };
  }

  private setFpsLimit() {
    this.gameSettings.FpsLimit = this.fpsLimit[FpsLimit.enabled].checked
      ? +this.fpsLimit[FpsLimit.value].value : 0;
  }

  constructor(parentId: string, gameSettings: IGameSettings) {
    super(parentId, template, style);
    this.gameSettings = gameSettings;
    this.fpsLimit = this.initSetting();
  }
}

export default SettingsGame;
