import { Category } from "../model"

export interface LoadCategoryById {
  loadById: (id: number) => Promise<LoadCategoryById.Result>
}

export namespace LoadCategoryById{
  export type Result = Category
}
