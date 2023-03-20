import { AddExpense } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";
import { RemoteAddExpense } from "../../../data/usecase";

export const makeRemoteAddExpense = (): AddExpense => 
  new RemoteAddExpense(
    makeApiUrl("expense"),
    makeAxiosHttpClient()
  )
