import { ReactNode } from "react";
import EditCategoryForm from "../../../presentation/pages/edit-category/edit-category";
import { makeRemoteEditCategory, makeRemoteLoadCategoryById } from "../usecases";


export default function MakeEditCategoryPage(): ReactNode {
  return (
    <>
      <EditCategoryForm
        editCategory={makeRemoteEditCategory()}
        loadCategoryById={makeRemoteLoadCategoryById()}
      />
    </>
  )
}
