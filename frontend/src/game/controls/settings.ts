import Action from './actions.enum';
import IControlsSettings from './iControlsSettings.interface';

class ControlsSettings implements IControlsSettings {
  private settings: Record<Action, string> = {
    [Action.moveRight]: 'KeyD',
    [Action.moveLeft]: 'KeyA',
    [Action.moveDown]: 'KeyS',
    [Action.run]: 'Space',
    [Action.attackLight]: 'KeyI',
    [Action.attackHeavy]: 'KeyO',
    [Action.attackRange]: 'KeyP',
  };

  public set(action:Action, value:string):void {
    this.settings[action] = value;
  }

  public get(action:Action):string {
    return this.settings[action];
  }
}

export default ControlsSettings;
