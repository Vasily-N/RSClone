import { Api } from '../apiServices/api';
import Services from '../apiServices/apiServices';
import { Game, IGame } from '../game';
import { IView } from '../views';
import AppPage from '../views/app';

class App {
  page:IView;

  constructor() {
    const api = new Api('http://localhost:3000/');
    const serviceOptions = { };
    const services:Services = { placeholder1: null, placeholder2: null };
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
