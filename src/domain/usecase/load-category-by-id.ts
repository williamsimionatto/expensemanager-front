import { Category } from "../model"

export interface LoadCategoryById {
  loadById: () => Promise<LoadCategoryById.Result>
}

export namespace LoadCategoryById{
  export type Result = Category
}
