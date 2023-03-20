export interface DeletePeriodCategory {
  delete: (periodId: string, categoryId: string) => Promise<void>
}
