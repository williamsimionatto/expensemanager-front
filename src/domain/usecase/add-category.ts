import { Category } from "../model"

export interface AddCategory {
  add: (params: AddCategory.Params) => Promise<Category>
}

export namespace AddCategory {
  export type Params = {
    name: string
    description: string
  }

  export type Result = Category
}
