import { RemoteExpenseListResultModel } from "../model"

export interface LoadExpenses { 
  load: () => Promise<LoadExpenses.Result>
}

export namespace LoadExpenses {
  export type Result = RemoteExpenseListResultModel[]
}