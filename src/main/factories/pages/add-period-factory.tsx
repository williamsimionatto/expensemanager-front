import { ReactNode } from "react";
import AddPeriodForm from "../../../presentation/pages/add-period/add-period";
import { makeremoteAddPeriod } from "../usecases";

export default function makeAddPeriodPage(): ReactNode {
  return (
    <>
      <AddPeriodForm
        addPeriod={makeremoteAddPeriod()}
      />
    </>
  )
}
