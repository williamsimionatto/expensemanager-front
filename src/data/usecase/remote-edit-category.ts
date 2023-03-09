import { Category } from "../../domain/model";
import { EditCategory } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteEditCategory implements EditCategory {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteEditCategory.Result>
  ) {}

  async edit (id: string, params: EditCategory.Params): Promise<EditCategory.Result> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${id}`,
      method: 'put',
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body as Category;
      default: throw new Error('Unexpected error');
    }
  }
}

export namespace RemoteEditCategory {
  export type Result = EditCategory.Result;
}