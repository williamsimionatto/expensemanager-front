import { Category } from "../model"

export interface EditCategory {
  edit: (params: EditCategory.Params) => Promise<EditCategory.Result>
}

export namespace EditCategory {
  export type Params = {
    id: string
    name: string
    description: string
  }

  export type Result = Category
}
