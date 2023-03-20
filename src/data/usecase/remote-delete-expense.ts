import { DeleteExpense } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteDeleteExpense implements DeleteExpense {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<void>
  ) {}

  async delete(expenseId: number): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${expenseId}`,
      method: 'delete'
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.noContent: return;
      default:
        throw new Error('Unexpected error');
    }
  }
}
