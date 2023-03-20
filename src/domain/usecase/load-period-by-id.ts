import { RemotePeriodResultModel } from "../model"

export interface LoadPeriodById {
  loadById: (id: string) => Promise<LoadPeriodById.Result>
}

export namespace LoadPeriodById {
  export type Result = RemotePeriodResultModel
}
