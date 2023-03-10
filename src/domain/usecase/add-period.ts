import { RemotePeriodResultModel } from "../model"

export interface AddPeriod {
  add: (params: AddPeriod.Params) => Promise<AddPeriod.Result | AddPeriod.Error>
}

export namespace AddPeriod {
  export type Params = {
    name: string
    startDate: string
    endDate: string
    budget: number
    categories: AddPeriodCategory[]
  }

  export type Result = RemotePeriodResultModel
  export type Error =  {
    details: string;
    message: string;
    timestamp: Date;
  }

  export type AddPeriodCategory = {
    categoryId: number
    budget: number
  }
}
