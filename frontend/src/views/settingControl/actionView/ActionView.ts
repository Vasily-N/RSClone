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

    valueSeting.addEventListener('click', (me:MouseEvent) => {
      if (!me.target) return;
      me.preventDefault();
      const element = me.target as HTMLElement;
      // сделать: визуальное отображение клика
      const event = 'keypress';
      function handleKey(ke:KeyboardEvent) {
        console.log(element);
        console.log(ke);
        // сделать: обработка
        window.removeEventListener(event, handleKey);
      }

      window.addEventListener(event, handleKey);
    });

    return valueSeting;
  }

  init() {
    const element = this.getElementById('setting__class') as Element;
    const elementText = document.createElement('div');
    elementText.classList.add('name__seting');
    element.appendChild(elementText);
    elementText.textContent = ControlsAction[this.value];
    const valueButtons = [...this.controlsSettings.get(this.value)];
    while (valueButtons.length < 3) valueButtons.push('free');

    valueButtons.forEach((value: string) => {
      const newButton = ActionView.creteButton(value);

      element.appendChild(newButton);
    });
  }

  constructor(parentId: string, controlsSettings:IControlsSettings, value:ControlsAction) {
    super(parentId, template, style);
    this.value = value;
    this.controlsSettings = controlsSettings;
    this.init();
  }
}

export default ActionView;
