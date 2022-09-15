import { ITimeService } from './boarderServices/timeService';
import { IWinService } from './boarderServices/winService';
import { IUserService } from './userServices';

type ApiServices = {
  wins: IWinService,
  times: ITimeService,
  users: IUserService,
};

export default ApiServices;
