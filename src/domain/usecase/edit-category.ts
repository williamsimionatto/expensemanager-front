export interface EditCategory {
  edit: (params: EditCategory.Params) => Promise<EditCategory.Result>
}

export namespace EditCategory {
  export type Params = {
    id: string
    name: string
    description: string
  }

  export type Result = boolean
}
