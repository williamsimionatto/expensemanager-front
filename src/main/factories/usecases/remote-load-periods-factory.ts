import { RemoteLoadPeriods } from "../../../data/usecase";
import { LoadPeriods } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteLoadPeriods = (): LoadPeriods => 
  new RemoteLoadPeriods(
    makeApiUrl('period'),
    makeAxiosHttpClient()
  )
