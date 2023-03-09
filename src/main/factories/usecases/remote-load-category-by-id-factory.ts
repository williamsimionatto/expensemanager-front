import { RemoteLoadCategoryById } from "../../../data/usecase";
import { LoadCategoryById } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteLoadCategoryById = (): LoadCategoryById => 
  new RemoteLoadCategoryById(
    makeApiUrl('expense-category'),
    makeAxiosHttpClient()
  )
