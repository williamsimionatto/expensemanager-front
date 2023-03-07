export interface AddCategories {
  add: (params: AddCategories.Params) => Promise<void>
}

export namespace AddCategories {
  export type Params = {
    name: string
    description: string
  }
}
