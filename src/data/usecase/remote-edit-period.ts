import { EditPeriod } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteEditPeriod implements EditPeriod {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteEditPeriod.Result | RemoteEditPeriod.Error>
  ) {}

  async edit(id: string, params: EditPeriod.Params): Promise<EditPeriod.Result | RemoteEditPeriod.Error> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${id}`,
      method: 'put',
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body as EditPeriod.Result;
      default: 
        const error = httpResponse.body as EditPeriod.Error;
        throw new Error(error.message || 'Unexpected error');
    }
  }
}

export namespace RemoteEditPeriod {
  export type Result = EditPeriod.Result;
  export type Error = EditPeriod.Error;
}
