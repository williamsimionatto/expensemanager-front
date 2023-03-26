import { RemoteCategoryResultModel } from "../model"

export interface LoadPeriodCategories {
  load: (periodId: string) => Promise<LoadPeriodCategories.Result>
}

export namespace LoadPeriodCategories {
  export type Result = RemoteCategoryResultModel[]
}
