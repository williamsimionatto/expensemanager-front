import { RemoteDeletePeriodCategory } from "../../../data/usecase";
import { DeletePeriodCategory } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteDeletePeriodCategory = (): DeletePeriodCategory => {
  return new RemoteDeletePeriodCategory(
    makeApiUrl('period'),
    makeAxiosHttpClient()
  );
}
