import template from './index.html';
import style from '../settingControl.scss';
import { View } from '../..';
import { IControlsSettings, ControlsAction } from '../../../services';

class ActionView extends View {
  private value: ControlsAction;
  private controlsSettings: IControlsSettings;
  init() {
    const element = this.getElementById('setting__class') as Element;
    const elementText = document.createElement('div');
    elementText.classList.add('name__seting');
    element.appendChild(elementText);
    elementText.textContent = ControlsAction[this.value];
    const valueButtons = this.controlsSettings.get(this.value);

    const creteButton = (el: string) => {
      const valueSeting = document.createElement('div');
      valueSeting.classList.add('value__seting');
      valueSeting.id = 'value__seting';
      valueSeting.textContent = el;
      element.appendChild(valueSeting);
    };

    valueButtons.forEach((value: string) => {
      creteButton(value);
    });
    if (valueButtons.size < 2) {
      creteButton('free');
    }
    if (valueButtons.size < 3) {
      creteButton('free');
    }
  }

  initEventListen() {
    const elelemnt = this.getElementById('value__seting') as Element;
    console.log(elelemnt);
  }

  constructor(parentId: string, controlsSettings:IControlsSettings, value:ControlsAction) {
    super(parentId, template, style);
    this.value = value;
    this.controlsSettings = controlsSettings;
    this.init();
    this.initEventListen();
  }
}

export default ActionView;
