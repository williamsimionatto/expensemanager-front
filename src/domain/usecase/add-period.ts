import { RemotePeriodListResultModel } from "../model"

export interface AddPeriod {
  add: (params: AddPeriod.Params) => Promise<AddPeriod.Result>
}

export namespace AddPeriod {
  export type Params = {
    name: string
    startDate: Date
    endDate: Date
    budget: number
    categories: AddPeriodCategory[]
  }

  export type Result = RemotePeriodListResultModel & {
    categories: []
  }

  type AddPeriodCategory = {
    categoryId: number
    budget: number
  }
}
