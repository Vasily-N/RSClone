import template from './index.html';
import style from './settingIsGame.scss';
import { View } from '..';
import { IGameSettings } from '../../services';

class SettingIsGame extends View {
  gameSettings: IGameSettings;

  initSetting() {
    const boxesDrow = this.getElementById('boxes__drow') as HTMLInputElement;
    if (this.gameSettings.DrawBoxes) boxesDrow.checked = true;
    boxesDrow?.addEventListener('click', () => {
      this.gameSettings.DrawBoxes = !this.gameSettings.DrawBoxes;
    });
    const FpsDisplay = this.getElementById('fps__display') as HTMLInputElement;
    if (this.gameSettings.FpsDisplay) FpsDisplay.checked = true;
    FpsDisplay?.addEventListener('click', () => {
      this.gameSettings.FpsDisplay = !this.gameSettings.FpsDisplay;
    });
    const drawSurfaces = this.getElementById('draw__surfaces') as HTMLInputElement;
    if (this.gameSettings.DrawSurfaces) drawSurfaces.checked = true;
    drawSurfaces?.addEventListener('click', () => {
      this.gameSettings.DrawSurfaces = !this.gameSettings.DrawSurfaces;
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
  }
}

export default SettingIsGame;
