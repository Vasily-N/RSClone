import {
  Api, Services, GameSettings, ControlsSettings, ControlsAction, SoundPlay,
} from '../services';
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
