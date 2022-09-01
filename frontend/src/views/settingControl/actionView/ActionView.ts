import template from './index.html';
import style from '../settingControl.scss';
import { View } from '../..';
import { IControlsSettings, ControlsAction } from '../../../services';

class ActionView extends View {
  private value: ControlsAction;
  private controlsSettings: IControlsSettings;

  private creteButton(el: string, valueButtons: string[]):HTMLDivElement {
    const valueSeting = document.createElement('div');
    valueSeting.classList.add('value__seting');
    valueSeting.id = el;
    valueSeting.textContent = el;
    const valueButton = valueButtons;

    valueSeting.addEventListener('click', (me) => {
      if (!me.target) return;
      me.preventDefault();
      const idName: string = (me.target as HTMLElement).id;
      const element = me.target as HTMLElement;
      element.classList.add('add__value');

      function handler(e:MouseEvent) {
        if ((e.target as HTMLElement).classList.contains('value__seting')) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
      document.addEventListener('click', handler, true);
      const event = 'keypress';
      const handleKey = (ke:KeyboardEvent) => {
        element.classList.remove('add__value');
        element.textContent = ke.code;
        const index = valueButton.indexOf(idName);
        valueButton[index] = ke.code;
        this.controlsSettings.set(this.value, valueButton);
        document.removeEventListener('click', handler, true);

        window.removeEventListener(event, handleKey);
      };
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
      const newButton = this.creteButton(value, valueButtons);

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
