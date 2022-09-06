import template from './index.html';
import style from './settingSound.scss';
import { View } from '..';
import { ISoundSettings } from '../../services';

class SettingSound extends View {
  settingSound: ISoundSettings;

  init() {
    const musicVolume = this.getElementById('music');
    (musicVolume as HTMLInputElement).value = String(this.settingSound.MusicVolume * 100);
    musicVolume?.addEventListener('change', (e) => {
      const value = Number((e.target as HTMLInputElement).value);
      this.settingSound.MusicVolume = +value / 100;
    });
    const SoundsVolume = this.getElementById('Sounds');
    (SoundsVolume as HTMLInputElement).value = String(this.settingSound.SoundsVolume * 100);
    SoundsVolume?.addEventListener('change', (e) => {
      const value = Number((e.target as HTMLInputElement).value);
      this.settingSound.SoundsVolume = +value / 100;
    });
  }

  constructor(parentId: string, settingSound: ISoundSettings) {
    super(parentId, template, style);
    this.settingSound = settingSound;
    this.init();
  }
}

export default SettingSound;
