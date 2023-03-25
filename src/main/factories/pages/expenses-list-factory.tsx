import { ReactNode } from "react";
import ExpenseList from "../../../presentation/pages/expense-list/expense-list";
import { makeRemoteLoadExpenses } from "../usecases/remote-load-expense-factory";

export default function makeExpenseListPage(): ReactNode {
  return (
    <>
      <ExpenseList
        loadExpenses={makeRemoteLoadExpenses()}
      />
    </>
  )
}