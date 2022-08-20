import { Api } from '../services/apiServices/api';
import Services from '../services';
import ControlsSettings from '../game/controls/settings';
import GameSettings from '../game/setiings';
import { IView } from '../views';
import AppPage from '../views/app';

class App {
  page:IView;

  contolsSettings = new ControlsSettings();

  constructor() {
    const api = new Api('http://localhost:3000/');
    const serviceOptions = { };
    const services:Services = {
      controlsSettings: new ControlsSettings(),
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
