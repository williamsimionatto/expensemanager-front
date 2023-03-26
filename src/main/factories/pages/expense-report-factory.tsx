import { ReactNode } from "react";
import ExpenseReport from "../../../presentation/pages/expense-report/expense-report";
import { makeRemoteLoadPeriodById, makeRemoteLoadPeriods } from "../usecases";

export default function makeExpenseReportPage(): ReactNode {
  return (
    <>
      <ExpenseReport
        loadPeriodById={makeRemoteLoadPeriodById()}
        loadPeriods={makeRemoteLoadPeriods()}
      />
    </>
  )
}
