import { AddPeriod } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteAddPeriod implements AddPeriod {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteAddPeriod.Result | RemoteAddPeriod.Error>
  ) {}

  async add(params: AddPeriod.Params): Promise<RemoteAddPeriod.Result | RemoteAddPeriod.Error> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "post",
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body as AddPeriod.Result;
      default:
        const error = httpResponse.body as AddPeriod.Error;
        throw new Error(error.message || "Unexpected error");
    }
  }
}

export namespace RemoteAddPeriod {
  export type Result = AddPeriod.Result;
  export type Error = AddPeriod.Error;
}
