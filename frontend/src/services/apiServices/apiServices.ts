import { ITimeService } from './boarderServices';
import { IUserService } from './userServices';

type ApiServices = {
  placeholder1:null,
  times: ITimeService,
  users: IUserService,
};

export default ApiServices;
