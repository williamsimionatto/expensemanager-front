import { RemoteAddPeriod } from "../../../data/usecase";
import { AddPeriod } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteAddPeriod = (): AddPeriod =>
  new RemoteAddPeriod(
    makeApiUrl("period"),
    makeAxiosHttpClient()
  )
