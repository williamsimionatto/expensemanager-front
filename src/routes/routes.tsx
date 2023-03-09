import { Route, Routes } from 'react-router-dom'
import makeAddCategoryPage from '../main/factories/pages/add-category-factory';
import makeCategoriesListPage from '../main/factories/pages/categories-list-factory';
import makeEditCategoryPage from '../main/factories/pages/edit-category-factory';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path='/categories' element={makeCategoriesListPage()}/>
      <Route path='/categories/add' element={makeAddCategoryPage()} />
      <Route 
        path='/categories/:categoryId' 
        element={makeEditCategoryPage()}
      />
    </Routes>
  );
}
export default Router;