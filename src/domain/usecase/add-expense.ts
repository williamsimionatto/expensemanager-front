import { RemoteExpenseResultModel } from "../model"

export interface AddExpense {
  add: (params: AddExpense.Params) => Promise<AddExpense.Result>
}

export namespace AddExpense {
  export type Params = {
    categoryId: number
    description: string
    amount: number
    date: Date
    periodId: number
  }

  export type Result = RemoteExpenseResultModel
}
