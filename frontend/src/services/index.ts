import ApiServices from './apiServices/apiServices';
import IControlsSettings from '../game/services/controls/iControlsSettings';
import ControlsAction from '../game/services/controls/actions.enum';
import IGameSettings from '../game/services/settings/iGameSettings';

type Services = {
  controls: { settings: IControlsSettings, action: typeof ControlsAction }
  gameSettings: IGameSettings
  api: ApiServices
};

export {
  Services, ApiServices, IGameSettings, IControlsSettings, ControlsAction,
};
