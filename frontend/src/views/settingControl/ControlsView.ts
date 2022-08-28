import template from './index.html';
import style from './settingControl.scss';
import { View } from '..';
import { IControlsSettings, ControlsAction } from '../../services';
import ActionView from './actionView/ActionView';

type Views = Record<ControlsAction, ActionView>;

class ControlsView extends View {
  private controls: IControlsSettings;
  private views:Views;

  private init():Views {
    return Object.keys(ControlsAction)
      .filter((v) => Number.isNaN(Number(v)))
      .map((v) => v as unknown as ControlsAction)
      .reduce(
        (res, v) => ({ ...res, [v]: new ActionView('setting__control', this.controls, v) }),
        {},
      ) as Record<ControlsAction, ActionView>;
  }

  constructor(parentId: string, controls:IControlsSettings) {
    super(parentId, template, style);
    this.controls = controls;
    this.views = this.init();
  }

  public append() {
    super.append();
    Object.values(this.views).forEach((v) => v.append());
  }
}

export default ControlsView;
