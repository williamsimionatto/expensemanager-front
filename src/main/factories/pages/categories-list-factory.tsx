import React from 'react'
import CategoryList from '../../../presentation/pages/categories/categories-list'
import { makeRemoteLoadCategories } from '../usecases'

export const makeCategoriesList: React.FC = () => {
  return (
    <CategoryList
      loadCategories={makeRemoteLoadCategories()}
    />
  )
}
