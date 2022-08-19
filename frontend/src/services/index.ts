import ApiServices from './apiServices/apiServices';
import IControlsSettings from '../game/controls/iControlsSettings.interface';

type Services = {
  controlsSetting: IControlsSettings;
  api: ApiServices;
};

export default Services;
