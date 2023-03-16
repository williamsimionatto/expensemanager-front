import { ReactNode } from "react";
import AddPeriodForm from "../../../presentation/pages/add-period/add-period";
import { makeRemoteAddPeriod, makeRemoteLoadCategories } from "../usecases";

export default function makeAddPeriodPage(): ReactNode {
  return (
    <>
      <AddPeriodForm
        addPeriod={makeRemoteAddPeriod()}
        loadCategories={makeRemoteLoadCategories()}
      />
    </>
  )
}
