import template from './index.html';
import style from '../settingControl.scss';
import { View } from '../..';
import { IControlsSettings, ControlsAction } from '../../../services';

class ActionView extends View {
  private value: ControlsAction;
  private controlsSettings: IControlsSettings;

  private static creteButton(el: string):HTMLDivElement {
    const valueSeting = document.createElement('div');
    valueSeting.classList.add('value__seting');
    valueSeting.id = 'value__seting';
    valueSeting.textContent = el;
    return valueSeting;
  }

  init() {
    const element = this.getElementById('setting__class') as Element;
    const elementText = document.createElement('div');
    elementText.classList.add('name__seting');
    element.appendChild(elementText);
    elementText.textContent = ControlsAction[this.value];
    const valueButtons = this.controlsSettings.get(this.value);

    valueButtons.forEach((value: string) => {
      const newButton = ActionView.creteButton(value);
      // дальше сам
    });
    if (valueButtons.size < 2) {
      ActionView.creteButton('free');
    }
    if (valueButtons.size < 3) {
      ActionView.creteButton('free');
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
