import { DeletePeriodCategory } from "../../domain/usecase";
import { HttpClient, HttpStatusCode } from "../protocols/http";

export class RemoteDeletePeriodCategory implements DeletePeriodCategory {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<void>
  ) {}

  async delete(periodId: string, categoryId: string): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${periodId}/${categoryId}`,
      method: 'delete'
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.noContent: return;
      default: 
        throw new Error('Unexpected error');
    }
  }
}
