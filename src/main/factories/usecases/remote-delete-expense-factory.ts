import { RemoteDeleteExpense } from "../../../data/usecase";
import { DeleteExpense } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteDeleteExpense = (): DeleteExpense => 
  new RemoteDeleteExpense(
    makeApiUrl("expense"),
    makeAxiosHttpClient()
  )
