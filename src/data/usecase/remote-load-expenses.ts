import { LoadExpenses } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteLoadExpenses implements LoadExpenses {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadExpenses.Result>
  ) {}

  async load(): Promise<LoadExpenses.Result> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    })

    const remoteExpenses = httpResponse.body

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: 
        return remoteExpenses?.length ? remoteExpenses : []      
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteLoadExpenses {
  export type Result = LoadExpenses.Result
}