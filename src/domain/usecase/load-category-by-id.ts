import { RemoteCategoryResultModel } from "../model"

export interface LoadCategoryById {
  loadById: (id: string) => Promise<LoadCategoryById.Result>
}

export namespace LoadCategoryById{
  export type Result = RemoteCategoryResultModel
}
