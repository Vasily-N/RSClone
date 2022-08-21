import { IApi, Data as Query, Api } from './api';

type ListResponse<T> = { // to types?
  totalCount: number,
  values?: T[],
};

abstract class ApiService {
  protected readonly api:IApi;

  protected readonly url;

  protected readonly options;

  constructor(api:IApi, url:string, options:Record<string, string>) {
    this.api = api;
    this.url = url;
    this.options = options;
  }

  protected getIdUrl(id:number) {
    return `${this.url}/${id}`;
  }

  protected async getAll<T>(query:Query):Promise<ListResponse<T>> {
    const res:Response = await this.api.get(this.url, query);
    if (!res.ok) return { totalCount: 0 };

    const totalCountS = res.headers.get(this.options.totalCount);
    const totalCount = totalCountS ? Number.parseInt(totalCountS, 10) : 0;
    return { totalCount, values: await res.json() };
  }

  protected async getId<T>(id:number):Promise<T | undefined> {
    const res:Response = await this.api.get(this.getIdUrl(id));
    return res.ok ? res.json() : res.status;
  }

  protected async create<T>(data:Query):Promise<T | undefined> {
    const res:Response = await this.api.post(this.url, data);
    return res.ok ? res.json() : undefined;
  }

  protected async delete(id:number):Promise<boolean | Response> {
    const res:Response = await this.api.delete(this.getIdUrl(id));
    return res.ok;
  }

  protected async update<T>(id:number, data:Query):Promise<T | undefined> {
    const res:Response = await this.api.put(this.getIdUrl(id), data);
    return res.ok ? res.json() : undefined;
  }
}

export { ApiService, IApi, Api };
