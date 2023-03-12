import { RemoteCategoryResultModel } from '../../domain/model';
import { AddCategory } from '../../domain/usecase';
import { HttpClient, HttpStatusCode } from '../protocols/http';

export class RemoteAddCategory implements AddCategory {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteAddCategory.Result>
  ) {}

  async add(params: AddCategory.Params): Promise<RemoteAddCategory.Result> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body as RemoteCategoryResultModel
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteAddCategory {
  export type Result = AddCategory.Result;
}
 