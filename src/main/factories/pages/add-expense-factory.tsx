import { ReactNode } from "react";
import AddExpenseForm from "../../../presentation/pages/add-expense/add-expense";
import { makeRemoteAddExpense, makeRemoteLoadPeriods } from "../usecases";

export default function makeAddExpensePage(): ReactNode {
  return (
    <>
      <AddExpenseForm 
        addExpense={makeRemoteAddExpense()}
        loadPeriods={makeRemoteLoadPeriods()}
      />
    </>
  )
}
