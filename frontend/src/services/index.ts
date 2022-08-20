import ApiServices from './apiServices/apiServices';
import IControlsSettings from '../game/services/controls/iControlsSettings';
import IGameSettings from '../game/services/settings/iGameSettings';

type Services = {
  controlsSettings: IControlsSettings
  gameSettings: IGameSettings
  api: ApiServices
};

export default Services;
