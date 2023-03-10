import { RemoteEditCategory } from "../../../data/usecase";
import { EditCategory } from "../../../domain/usecase";
import { makeApiUrl, makeAxiosHttpClient } from "../http";

export const makeRemoteEditCategory = (): EditCategory => {
  return new RemoteEditCategory(
    makeApiUrl('expense-category'),
    makeAxiosHttpClient()
  )
}
