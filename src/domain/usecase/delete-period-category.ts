export interface DeletePeriodCategory {
  delete: (periodId: string, categoryId: string) => Promise<DeletePeriodCategory.Result>
}

export namespace DeletePeriodCategory {
  export type Result = boolean
}
