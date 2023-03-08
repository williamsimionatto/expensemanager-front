import { LoadCategoryById } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteLoadCategoryById implements LoadCategoryById {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadCategoryById.Result>
  ) {}

  async loadById(id: number): Promise<LoadCategoryById.Result> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${id}`,
      method: 'get'
    })

    const remoteCategory = httpResponse.body

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteCategory as LoadCategoryById.Result
      default: throw new Error('Unexpected error')
    }
  }
}

export namespace RemoteLoadCategoryById {
  export type Result = LoadCategoryById.Result
}