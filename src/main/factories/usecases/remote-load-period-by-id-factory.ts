import { LoadPeriodById } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";
import { RemoteLoadPeriodById } from "../../../data/usecase";

export const makeRemoteLoadPeriodById = (): LoadPeriodById => 
  new RemoteLoadPeriodById(
    makeApiUrl('period'),
    makeAxiosHttpClient()
  )
