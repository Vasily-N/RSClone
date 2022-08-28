import template from './index.html';
import style from '../settingControl.scss';
import { View } from '../..';
import ControlsSettings from '../../../game/services/controls/settings';

class ActionView extends View {
  value: string | null;
  ControlsSettings: ControlsSettings;
  init() {
    const element = this.getElementById('setting__class') as Element;
    element.textContent = this.value;
    this.ControlsSettings.get(this.value);
  }

  constructor(parentId: string, value: string) {
    super(parentId, template, style);
    this.value = value;
    this.init();
    this.ControlsSettings = new ControlsSettings();
  }
}

export default ActionView;
