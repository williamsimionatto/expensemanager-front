import { RemoteAddPeriod } from "../../../data/usecase";
import { AddPeriod } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeremoteAddPeriod = (): AddPeriod =>
  new RemoteAddPeriod(
    makeApiUrl("period"),
    makeAxiosHttpClient()
  )
