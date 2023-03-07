import { ReactNode } from 'react'
import CategoryList from '../../../presentation/pages/categories/categories-list'
import { makeRemoteLoadCategories } from '../usecases'

export default function makeCategoriesListPage(): ReactNode {
  return (
    <>
      <CategoryList
        loadCategories={makeRemoteLoadCategories()}
      />
    </>
  )
}

