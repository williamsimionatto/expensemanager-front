import { ReactNode } from "react";
import EditPeriodForm from "../../../presentation/pages/edit-period/edit-period";
import { makeRemoteDeletePeriodCategory, makeRemoteEditPeriod, makeRemoteLoadCategories, makeRemoteLoadPeriodById } from "../usecases";

export default function makeEditPeriodPage(): ReactNode {
  return (
    <>
      <EditPeriodForm
        editPeriod={makeRemoteEditPeriod()}
        loadCategories={makeRemoteLoadCategories()}
        loadPeriodById={makeRemoteLoadPeriodById()}
        deletePeriodCategory={makeRemoteDeletePeriodCategory()}
      />
    </>
  )
}
