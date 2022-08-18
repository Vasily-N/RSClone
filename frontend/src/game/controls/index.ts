import Action from './actions.enum';
import IControlsSettings from './iControlsSettings.interface';

class Controls {
  private readonly buttons:Set<string> = new Set();
  private readonly settings:IControlsSettings;

  private initListeners() {
    document.addEventListener('keydown', this.buttonPress.bind(this));
    document.addEventListener('keyup', this.buttonRelease.bind(this));
  }

  constructor(settings:IControlsSettings) {
    this.settings = settings;
    this.initListeners();
  }

  private static readonly ignoreKeys = new Set(['ControlLeft', 'F5', 'AltLeft', 'AltRight', 'Tab']);

  private buttonPress(e:KeyboardEvent):void {
    if (e.repeat) return;
    if (Controls.ignoreKeys.has(e.code)) return;
    this.buttons.add(e.code);
    console.log('press', this.buttons);
  }

  private buttonRelease(e:KeyboardEvent):void {
    e.preventDefault();
    this.buttons.delete(e.code);
    console.log('release', this.buttons);
  }

  public has(action:Action):boolean {
    const buttons = [...this.settings.get(action)];
    return buttons.some((b) => this.buttons.has(b));
  }
}

export default Controls;
