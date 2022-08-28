import template from './index.html';
import style from './settingControl.scss';
import { View } from '..';
import { Services } from '../../services';
import Action from '../../game/services/controls/actions.enum';

class ControlsView extends View {
  services: Services;

  init() {
    const obj = this.services.controls.action;
    for (const action in obj) {
      if (isNaN(Number(action))){
        let ActionView = new ActionView('setting__control');
        ActionView.append();
      }
    }
  }

  constructor(parentId: string, services: Services) {
    super(parentId, template, style);
    this.services = services;
    this.init();
  }
}

export default ControlsView;
