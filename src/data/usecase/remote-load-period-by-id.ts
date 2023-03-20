import { LoadPeriodById } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteLoadPeriodById implements LoadPeriodById {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadPeriodById.Result>
  ) {}

  async loadById(id: string): Promise<LoadPeriodById.Result> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${id}`,
      method: 'get'
    })

    const remotePeriod = httpResponse.body

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remotePeriod as LoadPeriodById.Result
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteLoadPeriodById {
  export type Result = LoadPeriodById.Result
}
