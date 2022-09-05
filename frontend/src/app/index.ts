import {
  Api, Services, GameSettings, ControlsSettings, ControlsAction, SoundPlay,
} from '../services';
import { TimeServices } from '../services/apiServices/boarderServices/timeService';
import { WinServices } from '../services/apiServices/boarderServices/winService';
import { UserServices } from '../services/apiServices/userServices';
import { IView } from '../views';
import AppPage from '../views/app';

class App {
  page:IView;
  contolsSettings = new ControlsSettings();

  constructor() {
    const api = new Api('http://localhost:3000/');
    const serviceOptions = { };
    const soundPlay = new SoundPlay();
    const services:Services = {
      controls: { settings: new ControlsSettings(), action: ControlsAction },
      gameSettings: new GameSettings(),
      sounds: { subsribe: soundPlay, settings: soundPlay, play: soundPlay },
      api: {
        wins: new WinServices(new Api('https://castledeploy.herokuapp.com/api/'), 'wins', {}),
        times: new TimeServices(new Api('https://castledeploy.herokuapp.com/api/'), 'times', {}),
        users: new UserServices(new Api('https://castledeploy.herokuapp.com/api/'), 'users', {}),
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
