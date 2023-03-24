import { RemoteCategoryResultModel, RemotePeriodResultModel } from "../model"

export interface EditPeriod {
  edit: (id: string, params: EditPeriod.Params) => Promise<EditPeriod.Result | EditPeriod.Error>
}

export namespace EditPeriod {
  export type Params = {
    name: string
    startDate: string
    endDate: string
    budget: number
    categories: RemoteEditPeriodCategory[]
  }

  export type Result = RemotePeriodResultModel
  export type Error =  {
    details: string;
    message: string;
    timestamp: Date;
  }

  export type RemoteEditPeriodCategory = {
    category: RemoteCategoryResultModel
    budget: number
  }
}
