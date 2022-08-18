import Action from './actions.enum';
import IControlsSettings from './iControlsSettings.interface';

class ControlsSettings implements IControlsSettings {
  private settings: Record<Action, Set<string>> = {
    [Action.moveRight]: new Set(['KeyD', 'ArrowRight']),
    [Action.moveLeft]: new Set(['KeyA', 'ArrowLeft']),
    [Action.moveDown]: new Set(['KeyS', 'ArrowDown']),
    [Action.run]: new Set(['Space']),
    [Action.attackLight]: new Set(['KeyI']),
    [Action.attackHeavy]: new Set(['KeyO']),
    [Action.attackRange]: new Set(['KeyP']),
  };

  public set(action:Action, values:string[]):void {
    this.settings[action] = new Set(values);
  }

  public get(action:Action):Set<string> {
    return this.settings[action];
  }
}

export default ControlsSettings;
