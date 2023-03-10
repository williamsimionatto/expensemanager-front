import { LoadPeriods } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteLoadPeriods implements LoadPeriods {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadPeriods.Result>
  ) {}

  async load(): Promise<LoadPeriods.Result> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    })

    const remotePeriods = httpResponse.body

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: 
        return remotePeriods?.length ? remotePeriods : []      
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteLoadPeriods {
  export type Result = LoadPeriods.Result
}