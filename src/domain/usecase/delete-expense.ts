export interface DeleteExpense {
  delete: (id: number) => Promise<void>
}
