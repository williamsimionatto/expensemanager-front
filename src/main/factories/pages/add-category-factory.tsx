import { ReactNode } from 'react'
import AddCategoryForm from '../../../presentation/pages/add-category/add-category'
import { makeRemoteAddCategory } from '../usecases'

export default function makeAddCategoryPage(): ReactNode {
  return (
    <>
      <AddCategoryForm
        addCategory={makeRemoteAddCategory()}
      />
    </>
  )
}