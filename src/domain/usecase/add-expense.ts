import { RemoteExpenseResultModel } from "../model"

export interface AddExpense {
  add: (params: AddExpense.Params) => Promise<AddExpense.Result | AddExpense.Error>
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
  export type Error =  {
    details: string;
    message: string;
    timestamp: Date;
  }
}
