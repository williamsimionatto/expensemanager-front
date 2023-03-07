import { RemoteLoadCategories } from "../../../data/usecase";
import { LoadCategories } from "../../../domain/usecase";
import { makeAxiosHttpClient } from "../http";
import { makeApiUrl } from "../http";

export const makeRemoteLoadCategories = (): LoadCategories => 
  new RemoteLoadCategories(
    makeApiUrl('expense-category'),
    makeAxiosHttpClient()
  )