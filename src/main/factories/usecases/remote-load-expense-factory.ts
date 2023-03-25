import { RemoteLoadExpenses } from "../../../data/usecase";
import { LoadExpenses } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteLoadExpenses = (): LoadExpenses =>
  new RemoteLoadExpenses(
    makeApiUrl('expense'),
    makeAxiosHttpClient()
  );