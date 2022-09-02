import Action from './actions.enum';
import IControlsSettings from './iControlsSettings';

class ControlsSettings implements IControlsSettings {
  private settings: Record<Action, Set<string>> = {
    [Action.moveRight]: new Set(['KeyD', 'ArrowRight']),
    [Action.moveLeft]: new Set(['KeyA', 'ArrowLeft']),
    [Action.jump]: new Set(['KeyW', 'ArrowUp']),
    [Action.sit]: new Set(['KeyS', 'ArrowDown']),
    [Action.run]: new Set(['Space']),
    [Action.attackLight]: new Set(['KeyI']),
    [Action.attackHeavy]: new Set(['KeyO']),
    [Action.attackRange]: new Set(['KeyP']),
    [Action.zoomUp]: new Set(['Equal', 'NumpadAdd']),
    [Action.zoomDown]: new Set(['Minus', 'NumpadSubtract']),
    [Action.pause]: new Set(['Escape']),
  };

  public set(action:Action, values:string[]):void {
    this.settings[action] = new Set(values);
    console.log(this.settings[action]);
  }

  public get(action:Action):Set<string> {
    return this.settings[action];
  }
}

export default ControlsSettings;
