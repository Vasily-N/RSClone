import { getAllEnumKeys } from 'enum-for';
import template from './index.html';
import style from './settingControl.scss';
import { View } from '..';
import { Services } from '../../services';

class ControlsView extends View {
  services: Services;
  init() {
    const obj = this.services.controls.action;
    const arr = getAllEnumKeys(obj);
  }

  constructor(parentId: string, services: Services) {
    super(parentId, template, style);
    this.services = services;
    this.init();
  }
}

export default ControlsView;
