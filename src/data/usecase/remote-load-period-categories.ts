import { LoadPeriodCategories } from '../../domain/usecase'
import { HttpClient, HttpStatusCode } from '../protocols/http'

export class RemoteLoadPeriodCategories implements LoadPeriodCategories {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadPeriodCategories.Result>
  ) {}

  async load(periodId: string): Promise<LoadPeriodCategories.Result> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${periodId}/category`,
      method: 'get'
    })

    const remoteCategories = httpResponse.body

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteCategories as LoadPeriodCategories.Result
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteLoadPeriodCategories {
  export type Result = LoadPeriodCategories.Result
}
