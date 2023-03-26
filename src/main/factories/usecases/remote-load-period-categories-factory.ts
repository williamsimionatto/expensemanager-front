import { RemoteLoadPeriodCategories } from "../../../data/usecase";
import { LoadPeriodCategories } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteLoadPeriodCategories = (): LoadPeriodCategories => 
  new RemoteLoadPeriodCategories(
    makeApiUrl('period'),
    makeAxiosHttpClient()
  )
