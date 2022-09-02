import template from './index.html';
import style from './settingSound.scss';
import { View } from '..';
import ISoundSettings from '../../game/services/sound/iSoundSettings';

class SettingSound extends View {
  settingSound: ISoundSettings;

  init() {
    const musicVolume = this.getElementById('music');
    (musicVolume as HTMLInputElement).value = String(this.settingSound.MusicVolume);
    musicVolume?.addEventListener('change', (e) => {
      const value = Number((e.target as HTMLInputElement).value);
      this.settingSound.MusicVolume = value;
    });
    const SoundsVolume = this.getElementById('Sounds');
    (SoundsVolume as HTMLInputElement).value = String(this.settingSound.SoundsVolume);
    SoundsVolume?.addEventListener('change', (e) => {
      const value = Number((e.target as HTMLInputElement).value);
      this.settingSound.SoundsVolume = value;
    });
  }

  constructor(parentId: string, settingSound: ISoundSettings) {
    super(parentId, template, style);
    this.settingSound = settingSound;
    this.init();
  }
}

export default SettingSound;
