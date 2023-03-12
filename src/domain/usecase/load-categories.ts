import { RemoteCategoryResultModel } from "../model"

export interface LoadCategories {
  load: () => Promise<LoadCategories.Result>
}

export namespace LoadCategories{
  export type Result = RemoteCategoryResultModel[]
} 