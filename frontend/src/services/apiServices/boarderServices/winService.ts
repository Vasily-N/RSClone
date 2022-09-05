import { ApiService, ListResponse } from '..';
import { Data } from '../api';

export type BoarderWin = {
  name: string,
  win: string,
  date: string,
  _id: string,
  __v: string,
};

export type WinData = {
  name: string,
  win: string,
  date: string,
};

interface IWinService {
  createWinData:(data: WinData) => Promise<WinData>;
  getTimesData:() => Promise<ListResponse<BoarderWin>>;
  getWinData:(id: string) => Promise<BoarderWin | undefined>;
  deleteWinData:(id: string) => Promise<boolean | Response>;
  updateWinData:(data: WinData) => Promise<BoarderWin | undefined>;
}

class WinServices extends ApiService implements IWinService {
  public async createWinData(data: WinData):Promise<WinData> {
    return (await super.create<WinData>(data)) as WinData;
  }

  public async getTimesData():Promise<ListResponse<BoarderWin>> {
    const query: Data = {};
    return super.getAll<BoarderWin>(query);
  }

  public async getWinData(id: string):Promise<BoarderWin | undefined> {
    return super.getId<BoarderWin>(id);
  }

  public async deleteWinData(id: string):Promise<boolean | Response> {
    return super.delete(id);
  }

  public async updateWinData(data: WinData):Promise<BoarderWin | undefined> {
    return super.update<BoarderWin>(data);
  }
}

export { IWinService, WinServices };
