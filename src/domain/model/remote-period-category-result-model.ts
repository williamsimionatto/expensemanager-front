import { RemoteCategoryResultModel, RemoteExpenseResultModel } from "./"

export type RemotePeriodCategoryResultModel = {
  id: number
  category: RemoteCategoryResultModel
  budget: number
  expenses: RemoteExpenseResultModel[]
}