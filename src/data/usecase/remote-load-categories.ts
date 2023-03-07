import { LoadCategories } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteLoadCategories implements LoadCategories {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadCategories.Result>
  ) {}

  async load(): Promise<LoadCategories.Result> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    })

    const remoteCategories = httpResponse.body

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: 
        return remoteCategories?.length ? remoteCategories : []      
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteLoadCategories {
  export type Result = LoadCategories.Result;
}
