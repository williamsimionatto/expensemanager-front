import { AddPeriod } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteAddPeriod implements AddPeriod {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteAddPeriod.Result>
  ) {}

  async add(params: AddPeriod.Params): Promise<RemoteAddPeriod.Result> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: "post",
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body as AddPeriod.Result;
      default: throw new Error("Unexpected error");
    }
  }
}

export namespace RemoteAddPeriod {
  export type Result = AddPeriod.Result;
}
