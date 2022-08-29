import { ApiService, IApi, Api } from './apiServices';
import ApiServices from './apiServices/apiServices';
import { ControlsSettings, IControlsSettings, ControlsAction } from '../game/services/controls';
import { GameSettings, IGameSettings } from '../game/services/settings';
import {
  ISoundPlay, ISoundSettings, ISoundSubscribe, SoundPlay,
} from '../game/services/sound';

type Services = {
  controls: { settings: IControlsSettings, action: typeof ControlsAction }
  sounds: { subsribe: ISoundSubscribe, settings: ISoundSettings, play:ISoundPlay }
  gameSettings: IGameSettings
  api: ApiServices
};

export {
  Services,
  ApiServices, ApiService, IApi, Api,
  IGameSettings, GameSettings,
  IControlsSettings, ControlsSettings, ControlsAction,
  ISoundPlay, ISoundSettings, ISoundSubscribe, SoundPlay,
};
