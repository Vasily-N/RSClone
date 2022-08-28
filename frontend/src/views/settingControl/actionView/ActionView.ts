import template from './index.html';
import style from '../settingControl.scss';
import { View } from '../..';

class ActionView extends View {
  constructor(parentId: string) {
    super(parentId, template, style);
  }
}

export default ActionView;
