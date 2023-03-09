import { Category } from "../model"

export interface EditCategory {
  edit: (id: string, params: EditCategory.Params) => Promise<EditCategory.Result>
}

export namespace EditCategory {
  export type Params = {
    name: string
    description: string
  }

  export type Result = Category
}
