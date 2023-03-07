import { Route, Routes } from 'react-router-dom'
import makeAddCategoryPage from '../main/factories/pages/add-category-factory';
import makeCategoriesListPage from '../main/factories/pages/categories-list-factory';

const Router: React.FC = () => {
  return (
      <Routes>
        <Route path='/categories' element={makeCategoriesListPage()}/>
        <Route path='/categories/add' element={makeAddCategoryPage()} />
      </Routes>
  );
}
export default Router;