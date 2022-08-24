import template from './index.html';
import style from './settingIsGame.scss';
import { View } from '..';
import { IGameSettings } from '../../services';

class SettingIsGame extends View {
  gameSettings: IGameSettings;

  initSetting() {
    const boxesDrow = this.getElementById('boxes__drow') as HTMLInputElement;
    boxesDrow.checked = this.gameSettings.DrawBoxes;
    boxesDrow?.addEventListener('click', () => {
      this.gameSettings.DrawBoxes = boxesDrow.checked;
    });
    const FpsDisplay = this.getElementById('fps__display') as HTMLInputElement;
    FpsDisplay.checked = this.gameSettings.FpsDisplay;
    FpsDisplay?.addEventListener('click', () => {
      this.gameSettings.FpsDisplay = FpsDisplay.checked;
    });
    const drawSurfaces = this.getElementById('draw__surfaces') as HTMLInputElement;
    drawSurfaces.checked = this.gameSettings.DrawSurfaces;
    drawSurfaces?.addEventListener('click', () => {
      this.gameSettings.DrawSurfaces = drawSurfaces.checked;
    });
    const fpsLimit = this.getElementById('fps__Limit') as HTMLInputElement;
    fpsLimit.value = String(this.gameSettings.FpsLimit);
    fpsLimit.addEventListener('change', (e) => {
      const value = +(e.target as HTMLInputElement).value;
      this.gameSettings.FpsLimit = value;
    });
    const zoomGame = this.getElementById('zoom__game') as HTMLInputElement;
    zoomGame.value = String(this.gameSettings.Zoom);
    zoomGame.addEventListener('change', (e) => {
      const value = +(e.target as HTMLInputElement).value;
      this.gameSettings.Zoom = value;
    });
  }

  constructor(parentId: string, gameSettings: IGameSettings) {
    super(parentId, template, style);
    this.gameSettings = gameSettings;
    this.initSetting();
  }
}

export default SettingIsGame;
