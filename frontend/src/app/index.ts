import {
  Api, Services, GameSettings, ControlsSettings, ControlsAction,
} from '../services';
import { UserServices } from '../services/apiServices/userServices';
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
      api: {
        placeholder1: null,
        placeholder2: null,
        users: new UserServices(new Api('http://127.0.0.1:5000/api/'), 'users', {}),
      },
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
