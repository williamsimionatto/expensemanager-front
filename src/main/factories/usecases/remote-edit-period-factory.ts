import { RemoteEditPeriod } from "../../../data/usecase"
import { EditPeriod } from "../../../domain/usecase"
import { makeApiUrl, makeAxiosHttpClient } from "../http"

export const makeRemoteEditPeriod = (): EditPeriod => {
  return new RemoteEditPeriod(
    makeApiUrl('period'),
    makeAxiosHttpClient()
  )
}
