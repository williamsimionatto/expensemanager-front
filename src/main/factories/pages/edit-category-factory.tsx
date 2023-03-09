import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import EditCategoryForm from "../../../presentation/pages/edit-category/edit-category";
import { makeRemoteEditCategory, makeRemoteLoadCategoryById } from "../usecases";

export default function MakeEditCategoryPage(): ReactNode {
  const params = useParams()
  const { id } = params

  return (
    <>
      <EditCategoryForm
        editCategory={makeRemoteEditCategory(id as string)}
        loadCategoryById={makeRemoteLoadCategoryById(id as string)}
      />
    </>
  )
}
