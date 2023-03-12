import { RemotePeriodCategoryResultModel } from "./remote-period-category-result-model"

export type RemotePeriodResultModel = {
  id: number
  name: string
  startDate: Date
  endDate: Date
  budget: number
  categories: RemotePeriodCategoryResultModel[]
}
