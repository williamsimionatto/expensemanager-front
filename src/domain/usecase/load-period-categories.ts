import { RemotePeriodCategoryResultModel } from "../model"

export interface LoadPeriodCategories {
  load: (periodId: string) => Promise<LoadPeriodCategories.Result>
}

export namespace LoadPeriodCategories {
  export type Result = RemotePeriodCategoryResultModel[]
}
