import { Period } from "../model"

export interface LoadPeriods {
  load: () => Promise<LoadPeriods.Result>
}

export namespace LoadPeriods {
  export type Result = Period[]
}
