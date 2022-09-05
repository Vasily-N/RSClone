import Action from './actions.enum';
import IControlsSettings from './iControlsSettings';

class ControlsSettings implements IControlsSettings {
  private settings: Record<Action, Set<string>> = {
    [Action.moveRight]: new Set(['KeyD', 'ArrowRight']),
    [Action.moveLeft]: new Set(['KeyA', 'ArrowLeft']),
    [Action.jump]: new Set(['KeyW', 'ArrowUp']),
    [Action.sit]: new Set(['KeyS', 'ArrowDown']),
    [Action.run]: new Set(['Space']),
    [Action.attackLight]: new Set(['KeyI', 'KeyZ', 'Numpad0']),
    [Action.attackHeavy]: new Set(['KeyO', 'KeyX', 'Numpad1']),
    [Action.attackRange]: new Set(['KeyP', 'KeyC', 'Numpad3']),
    [Action.zoomUp]: new Set(['Equal', 'NumpadAdd', 'PageUp']),
    [Action.zoomDown]: new Set(['Minus', 'NumpadSubtract', 'PageDown']),
    [Action.pause]: new Set(['Escape']),
    [Action.flipLeft]: new Set(['KeyQ', 'Numpad7']),
    [Action.flipRight]: new Set(['KeyE', 'Numpad9']),
  };

  public set(action:Action, values:string[]):void {
    this.settings[action] = new Set(values);
  }

  public get(action:Action):Set<string> {
    return this.settings[action];
  }
}

export default ControlsSettings;
