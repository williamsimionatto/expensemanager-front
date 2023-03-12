import { RemoteCategoryResultModel } from "../model"

export interface AddCategory {
  add: (params: AddCategory.Params) => Promise<RemoteCategoryResultModel>
}

export namespace AddCategory {
  export type Params = {
    name: string
    description: string
  }

  export type Result = RemoteCategoryResultModel
}
