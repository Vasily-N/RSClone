import ApiServices from './apiServices/apiServices';
import IControlsSettings from '../game/controls/iControlsSettings.interface';
import IGameSettings from '../game/settings.interface';

type Services = {
  controlsSettings: IControlsSettings
  gameSettings: IGameSettings
  api: ApiServices
};

export default Services;
