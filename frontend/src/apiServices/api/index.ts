type Data = Record<string, unknown>;

interface IApi {
  get: (url:string, query?:Data)=>Promise<Response>;
  post: (url:string, data:Data)=>Promise<Response>;
  put: (url:string, data:Data)=>Promise<Response>;
  delete: (url:string)=>Promise<Response>;
  patch: (url:string, query?:Data)=>Promise<Response>
}

class Api {
  private baseUrl;

  constructor(baseUrl:string) {
    this.baseUrl = baseUrl;
  }

  private static getQueryString(query?:Data):string {
    return !query ? ''
      : `?${Object.keys(query).map((key:string) => `${key}=${query[key]}`).join('&')}`;
  }

  private static getRequestInit(method:string, data:Data):RequestInit {
    return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  }

  private static getUrl(baseUrl:string, url:string, query?:Data):string {
    return `${baseUrl}${url}${Api.getQueryString(query)}`;
  }

  private getThisUrl(url:string, query?:Data):string {
    return Api.getUrl(this.baseUrl, url, query);
  }

  public async get(url:string, query?:Data):Promise<Response> {
    return fetch(this.getThisUrl(url, query), { method: 'GET' });
  }

  public async post(url:string, data:Data):Promise<Response> {
    return fetch(this.getThisUrl(url), Api.getRequestInit('POST', data));
  }

  public async put(url:string, data:Data):Promise<Response> {
    return fetch(this.getThisUrl(url), Api.getRequestInit('PUT', data));
  }

  public async delete(url:string):Promise<Response> {
    return fetch(this.getThisUrl(url), { method: 'DELETE' });
  }

  public async patch(url:string, query?:Data):Promise<Response> {
    return fetch(this.getThisUrl(url, query), { method: 'PATCH' });
  }
}

export { Api, IApi, Data };
