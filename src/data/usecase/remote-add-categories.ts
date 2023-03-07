import { Category } from '../../domain/model';
import { AddCategories } from '../../domain/usecase';
import { HttpClient, HttpStatusCode } from '../protocols/http';

export class RemoteAddCategories implements AddCategories {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteAddCategories.Result>
  ) {}

  async add(params: AddCategories.Params): Promise<RemoteAddCategories.Result> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body as Category
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteAddCategories {
  export type Result = AddCategories.Result;
}
