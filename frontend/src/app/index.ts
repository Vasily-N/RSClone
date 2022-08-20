import { Api } from '../services/apiServices/api';
import { Services, ControlsAction } from '../services';
import ControlsSettings from '../game/services/controls/settings';
import GameSettings from '../game/services/settings';
import { IView } from '../views';
import AppPage from '../views/app';

class App {
  page:IView;

  contolsSettings = new ControlsSettings();

  constructor() {
    const api = new Api('http://localhost:3000/');
    const serviceOptions = { };
    const services:Services = {
      controls: { settings: new ControlsSettings(), action: ControlsAction },
      gameSettings: new GameSettings(),
      api: { placeholder1: null, placeholder2: null },
    };
    this.page = new AppPage('body', services);
  }

  public start():void {
    this.page.append();
    App.taskConsole();
  }

  private static taskConsole():void {
    const info = null;
    // eslint-disable-next-line no-console
    if (info) console.log(info);
  }
}

export default App;
