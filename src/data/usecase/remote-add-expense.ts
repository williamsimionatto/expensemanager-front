import { AddExpense } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteAddExpense implements AddExpense {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteAddExpense.Result | RemoteAddExpense.Error>
  ) {}

  async add(params: AddExpense.Params): Promise<RemoteAddExpense.Result | RemoteAddExpense.Error> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body as AddExpense.Result;
      default:
        const error = httpResponse.body as AddExpense.Error;
        throw new Error(error.message || 'Unexpected error');
    }
  }
}

export namespace RemoteAddExpense {
  export type Result = AddExpense.Result;
  export type Error = AddExpense.Error;
}
