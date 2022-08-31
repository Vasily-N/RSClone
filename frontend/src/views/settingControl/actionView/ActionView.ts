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
    function handleClick(me:MouseEvent) {
      if (!me.target) return;
      me.preventDefault();
      const element = me.target as HTMLElement;

      const event = 'keypress';
      function handleKey(ke:KeyboardEvent) {
        element.classList.remove('add__value');
        element.textContent = ke.code;
        console.log(ke);
        // сделать: обработка
        window.removeEventListener(event, handleKey);
      }
      const classElements = document.getElementsByClassName('add__value');
      for (let i = 0; i < classElements.length; i++) {
        classElements[i].removeEventListener('click', handleClick);
        classElements[i].classList.remove('add__value');
      }


      element.classList.add('add__value');

     

      // сделать: визуальное отображение клика
      window.addEventListener(event, handleKey);
    }

    valueSeting.addEventListener('click', handleClick);

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
