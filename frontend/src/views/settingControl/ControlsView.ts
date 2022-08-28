import template from './index.html';
import style from './settingControl.scss';
import { View } from '..';
import { IControlsSettings } from '../../services';
import Action from '../../game/services/controls/actions.enum';
import ActionView from './actionView/ActionView';

type Views = { [key:string]: ActionView };

class ControlsView extends View {
  private controls: IControlsSettings;
  private views:Views;

  private static init():Views {
    return Object.keys(Action)
      .filter((v) => Number.isNaN(Number(v)))
      .reduce((res, v) => ({ ...res, [v]: new ActionView('setting__control') }), {});
  }

  constructor(parentId: string, controls:IControlsSettings) {
    super(parentId, template, style);
    this.controls = controls;
    this.views = ControlsView.init();
  }

  public append() {
    super.append();
    Object.values(this.views).forEach((v) => v.append());
  }
}

export default ControlsView;
