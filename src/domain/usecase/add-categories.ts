import { Category } from "../model"

export interface AddCategories {
  add: (params: AddCategories.Params) => Promise<Category>
}

export namespace AddCategories {
  export type Params = {
    name: string
    description: string
  }

  export type Result = Category
}
