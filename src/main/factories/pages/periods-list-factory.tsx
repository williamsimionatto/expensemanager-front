import { ReactNode } from "react";
import PeriodList from "../../../presentation/pages/period-list/periods-list";
import { makeRemoteLoadPeriods } from "../usecases";

export default function makePeriodsListPage(): ReactNode {
  return (
    <>
      <PeriodList
        loadPeriods={makeRemoteLoadPeriods()}
      />
    </>
  )
}
